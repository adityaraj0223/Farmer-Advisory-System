import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import SchemeRecord
from ..schemas import SchemeResponse
from ..config import settings

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

def seed_schemes_if_empty(db: Session):
    count = db.query(SchemeRecord).count()
    if count == 0:
        seed_path = settings.DATA_DIR / "verified_schemes.json"
        if seed_path.exists():
            with open(seed_path, "r", encoding="utf-8") as f:
                schemes_data = json.load(f)
                for s in schemes_data:
                    rec = SchemeRecord(
                        scheme_key=s["id"],
                        title=s["title"],
                        category=s["category"],
                        department=s["department"],
                        benefit=s["benefit"],
                        eligibility=s["eligibility"],
                        exclusions=s.get("exclusions", ""),
                        documents=s["documents"],
                        how_to_apply_steps=s["how_to_apply_steps"],
                        official_portal_url=s["official_portal_url"],
                        application_mode=s.get("application_mode", "Online"),
                        helpline=s.get("helpline", ""),
                        last_verified_date=s.get("last_verified_date", "2026-03-01"),
                        status=s.get("status", "Active")
                    )
                    db.add(rec)
                db.commit()
                print(f"[Schemes] Seeded {len(schemes_data)} verified government scheme records.")

@router.get("", response_model=List[SchemeResponse])
def list_schemes(db: Session = Depends(get_db)):
    seed_schemes_if_empty(db)
    schemes = db.query(SchemeRecord).all()
    return schemes

@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: str, db: Session = Depends(get_db)):
    seed_schemes_if_empty(db)
    scheme = db.query(SchemeRecord).filter(
        (SchemeRecord.scheme_key == scheme_id) | (SchemeRecord.id == (int(scheme_id) if scheme_id.isdigit() else -1))
    ).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found.")
    return scheme

@router.get("/verify-links/status")
def verify_scheme_links(db: Session = Depends(get_db)):
    seed_schemes_if_empty(db)
    schemes = db.query(SchemeRecord).all()
    results = []
    for s in schemes:
        is_gov = ".gov.in" in s.official_portal_url or "myscheme.gov.in" in s.official_portal_url
        results.append({
            "scheme_key": s.scheme_key,
            "title": s.title,
            "url": s.official_portal_url,
            "domain_verified_gov": is_gov,
            "last_verified_date": s.last_verified_date,
            "status": "Verified Official Portal" if is_gov else "External Resource"
        })
    return {"schemes_audited": len(results), "verified_destinations": results}
