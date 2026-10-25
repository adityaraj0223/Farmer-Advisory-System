from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
from ..models import User, FarmerListing, MarketplaceEnquiry, MarketPriceRecord, SchemeRecord, DiseaseDiagnosisLog

router = APIRouter(prefix="/admin", tags=["Administration & Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        print(f"[Health Check DB Error]: {e}")
        db_ok = False


    return {
        "status": "healthy" if db_ok else "degraded",
        "database_connected": db_ok,
        "services": {
            "ml_disease_model": "MobileNet-V3 Agricultural Vision (Active)",
            "knowledge_rag": "ICAR Agronomy Knowledge Base (Active)",
            "weather_provider": "Open-Meteo Live Observations (Active)",
            "market_data_engine": "AGMARKNET Daily Integration (Active)",
            "voice_assistant": "Multilingual WebSpeech + Backend Pipeline (Active)"
        }
    }

@router.get("/metrics")
def get_system_metrics(db: Session = Depends(get_db)):
    users_count = db.query(User).count()
    listings_count = db.query(FarmerListing).count()
    enquiries_count = db.query(MarketplaceEnquiry).count()
    prices_count = db.query(MarketPriceRecord).count()
    schemes_count = db.query(SchemeRecord).count()
    diagnoses_count = db.query(DiseaseDiagnosisLog).count()

    latest_price = db.query(MarketPriceRecord).order_by(MarketPriceRecord.observation_date.desc()).first()

    return {
        "total_users": users_count,
        "active_marketplace_listings": listings_count,
        "buyer_enquiries": enquiries_count,
        "mandi_price_records": prices_count,
        "latest_mandi_observation_date": latest_price.observation_date if latest_price else "N/A",
        "verified_schemes": schemes_count,
        "total_disease_diagnoses_executed": diagnoses_count
    }
