from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from ..database import get_db
from ..models import FarmerListing, MarketplaceEnquiry, User
from ..schemas import ListingCreate, ListingUpdate, ListingResponse, EnquiryCreate, EnquiryResponse
from ..auth import get_current_user

router = APIRouter(prefix="/marketplace", tags=["Farmer-to-Buyer Marketplace"])

def seed_marketplace_listings_if_empty(db: Session):
    count = db.query(FarmerListing).count()
    if count == 0:
        sample_listings = [
            FarmerListing(
                farmer_name="Gurpreet Singh",
                farmer_phone="+91 98765 11223",
                commodity="Sharbati Wheat",
                variety="HD-3086 Certified",
                grade="Grade A+ Export Quality",
                quantity=45.0,
                unit="Quintal",
                asking_price=2350.0,
                harvest_date="2026-03-20",
                pickup_location="Samrala, Ludhiana, Punjab",
                service_area_km=30.0,
                description="Naturally sun-dried golden Sharbati wheat. Moisture content strictly below 11%. Stored in clean hermetic bags.",
                image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop",
                status="active"
            ),
            FarmerListing(
                farmer_name="Sukhdev Singh",
                farmer_phone="+91 98140 44556",
                commodity="Basmati Rice",
                variety="Pusa-1121 Export Quality",
                grade="Grade A+ Long Grain",
                quantity=35.0,
                unit="Quintal",
                asking_price=4450.0,
                harvest_date="2026-03-18",
                pickup_location="Taraori, Karnal, Haryana",
                service_area_km=45.0,
                description="Aged aromatic 1121 steam basmati rice paddy. Average grain length 8.35mm, nil broken grains, moisture 11.5%.",
                image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop",
                status="active"
            ),
            FarmerListing(
                farmer_name="Manoj Yadav",
                farmer_phone="+91 94150 77889",
                commodity="Table Potato",
                variety="Kufri Jyoti",
                grade="Large (45mm+)",
                quantity=120.0,
                unit="Quintal",
                asking_price=1250.0,
                harvest_date="2026-03-22",
                pickup_location="Fatehabad Road, Agra, UP",
                service_area_km=40.0,
                description="Cold-storage cured table potatoes. Uniform size, no greening, zero skin blemishes. Direct farm-gate loading available.",
                image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop",
                status="active"
            ),
            FarmerListing(
                farmer_name="Sanjay Shinde",
                farmer_phone="+91 98220 33441",
                commodity="Red Onion",
                variety="Gavran Lasalgaon Red",
                grade="Medium (40-55mm)",
                quantity=80.0,
                unit="Quintal",
                asking_price=1750.0,
                harvest_date="2026-03-25",
                pickup_location="Niphad, Nashik, Maharashtra",
                service_area_km=35.0,
                description="Thoroughly dried and cured rabi red onions. Excellent pungency and shelf life (3-4 months).",
                image_url="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop",
                status="active"
            )
        ]
        db.add_all(sample_listings)
        db.commit()
        print("[Marketplace] Seeded active farmer produce listings.")

@router.get("/listings", response_model=List[ListingResponse])
def list_produce(
    commodity: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    status: Optional[str] = Query("active"),
    db: Session = Depends(get_db)
):
    seed_marketplace_listings_if_empty(db)
    q = db.query(FarmerListing)
    if status and status != "all":
        q = q.filter(FarmerListing.status == status)
    if commodity:
        q = q.filter(FarmerListing.commodity.ilike(f"%{commodity}%"))
    if min_price is not None:
        q = q.filter(FarmerListing.asking_price >= min_price)
    if max_price is not None:
        q = q.filter(FarmerListing.asking_price <= max_price)
    
    return q.order_by(FarmerListing.created_at.desc()).all()

@router.post("/listings", response_model=ListingResponse)
def create_listing(
    item_in: ListingCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    listing = FarmerListing(
        farmer_id=current_user.id if current_user else None,
        farmer_name=current_user.name if current_user else "Farmer Community Member",
        farmer_phone=current_user.phone if (current_user and current_user.phone) else "+91 98765 00000",
        commodity=item_in.commodity,
        variety=item_in.variety,
        grade=item_in.grade,
        quantity=item_in.quantity,
        unit=item_in.unit,
        asking_price=item_in.asking_price,
        harvest_date=item_in.harvest_date,
        pickup_location=item_in.pickup_location,
        service_area_km=item_in.service_area_km or 25.0,
        description=item_in.description,
        image_url=item_in.image_url or "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop",
        status="active"
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.get("/listings/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(FarmerListing).filter(FarmerListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    return listing

@router.patch("/listings/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    item_update: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    listing = db.query(FarmerListing).filter(FarmerListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")

    if item_update.asking_price is not None:
        listing.asking_price = item_update.asking_price
    if item_update.quantity is not None:
        listing.quantity = item_update.quantity
    if item_update.status is not None:
        listing.status = item_update.status

    db.commit()
    db.refresh(listing)
    return listing

@router.post("/enquiries", response_model=EnquiryResponse)
def create_enquiry(
    enq_in: EnquiryCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    listing = db.query(FarmerListing).filter(FarmerListing.id == enq_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Selected crop listing does not exist.")

    enquiry = MarketplaceEnquiry(
        listing_id=enq_in.listing_id,
        buyer_id=current_user.id if current_user else None,
        buyer_name=enq_in.buyer_name,
        buyer_phone=enq_in.buyer_phone,
        offered_price=enq_in.offered_price,
        requested_quantity=enq_in.requested_quantity,
        inspection_requested=enq_in.inspection_requested,
        proposed_pickup_date=enq_in.proposed_pickup_date,
        message=enq_in.message,
        status="inspection_scheduled" if enq_in.inspection_requested else "pending"
    )
    db.add(enquiry)

    if enq_in.inspection_requested:
        listing.status = "inspection_scheduled"

    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.get("/enquiries", response_model=List[EnquiryResponse])
def list_enquiries(
    listing_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(MarketplaceEnquiry)
    if listing_id:
        q = q.filter(MarketplaceEnquiry.listing_id == listing_id)
    return q.order_by(MarketplaceEnquiry.created_at.desc()).all()
