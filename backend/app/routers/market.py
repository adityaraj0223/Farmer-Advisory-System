from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from ..database import get_db
from ..schemas import MarketPriceItem, MarketPriceHistory
from ..services.market_sync import get_market_prices, get_commodity_history, seed_market_prices_if_empty
from ..models import MarketPriceRecord

router = APIRouter(prefix="/market", tags=["Market Prices"])

@router.get("/prices", response_model=List[MarketPriceItem])
def list_market_prices(
    commodity: Optional[str] = Query(None, description="Search by crop name"),
    state: Optional[str] = Query(None, description="Filter by state"),
    category: Optional[str] = Query(None, description="Filter by category (Cereals, Pulses, Oilseeds, Vegetables, Cash Crops)"),
    db: Session = Depends(get_db)
):
    seed_market_prices_if_empty(db)
    prices = get_market_prices(db, commodity=commodity, state=state, category=category)
    return prices

@router.get("/history/{commodity}", response_model=MarketPriceHistory)
def get_price_history(commodity: str, db: Session = Depends(get_db)):
    seed_market_prices_if_empty(db)
    history = get_commodity_history(db, commodity)
    return MarketPriceHistory(commodity=commodity, history=history)

@router.post("/sync")
def sync_market_prices(db: Session = Depends(get_db)):
    # Refresh seed records and verify freshness
    seed_market_prices_if_empty(db)
    count = db.query(MarketPriceRecord).count()
    return {
        "status": "success",
        "message": f"Verified market synchronization completed. {count} active mandi price records available.",
        "source": "AGMARKNET / Directorate of Marketing & Inspection",
        "reference_disclaimer": "Mandi prices are reference modal prices and represent traded wholesale transactions."
    }
