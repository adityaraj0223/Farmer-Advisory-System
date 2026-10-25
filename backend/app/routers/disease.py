import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import DiseaseDiagnosisLog, User
from ..auth import get_current_user
from ..schemas import DiseasePredictionResponse
from ..services.ml_disease_detector import disease_detector, DISEASE_CLASSES
from ..config import settings

router = APIRouter(prefix="/disease", tags=["Crop Disease Detection"])

@router.post("/predict", response_model=DiseasePredictionResponse)
async def predict_disease(
    file: UploadFile = File(...),
    crop_name: Optional[str] = Form("General Crop"),
    affected_part: Optional[str] = Form("Leaf"),
    symptoms: Optional[str] = Form(""),
    language: Optional[str] = Form("English"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file MIME type '{file.content_type}'. Please upload an image (JPEG, PNG, WebP)."
        )

    # Read image content
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds 10MB limit.")

    # Save image for audit record
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    safe_filename = f"{uuid.uuid4().hex}.{ext}"
    saved_path = settings.UPLOAD_DIR / safe_filename
    with open(saved_path, "wb") as f:
        f.write(contents)

    # Run real ML model inference
    try:
        result = disease_detector.predict(
            image_bytes=contents,
            crop_hint=crop_name,
            language=language
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution error: {str(e)}")

    # Persist diagnosis log in database
    diag_log = DiseaseDiagnosisLog(
        user_id=current_user.id if current_user else None,
        crop_name=result["crop_name"],
        affected_part=affected_part,
        predicted_disease=result["predicted_disease"],
        confidence=result["confidence"],
        is_healthy=result["is_healthy"],
        recommendations={
            "organic": result["organic_treatment"],
            "chemical": result["chemical_treatment"],
            "prevention": result["prevention_steps"]
        },
        image_filename=safe_filename,
        preferred_language=language
    )
    db.add(diag_log)
    db.commit()

    return DiseasePredictionResponse(**result)

@router.get("/classes")
def get_supported_classes():
    return {
        "total_classes": len(DISEASE_CLASSES),
        "supported_crops": ["Tomato", "Potato", "Wheat", "Rice / Paddy", "Corn", "Cotton"],
        "classes": DISEASE_CLASSES,
        "model_architecture": "MobileNet-V3 Agricultural Transfer Network",
        "dataset_reference": "PlantVillage + ICAR Crop Pathology Datasets"
    }

@router.get("/history")
def get_diagnosis_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(DiseaseDiagnosisLog)
    if current_user:
        query = query.filter(DiseaseDiagnosisLog.user_id == current_user.id)
    logs = query.order_by(DiseaseDiagnosisLog.created_at.desc()).limit(20).all()
    return logs
