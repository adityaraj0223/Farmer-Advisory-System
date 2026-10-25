from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(30), unique=True, index=True, nullable=True)
    email = Column(String(120), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    role = Column(String(30), default="farmer") # farmer, buyer, admin, guest
    preferred_language = Column(String(30), default="English")
    location = Column(String(150), default="Ludhiana, Punjab")
    farm_size_acres = Column(Float, default=5.0)
    primary_crops = Column(String(200), default="Wheat, Rice")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("FarmerListing", back_populates="farmer")
    enquiries = relationship("MarketplaceEnquiry", back_populates="buyer")
    diagnoses = relationship("DiseaseDiagnosisLog", back_populates="user")
    ledger_entries = relationship("LedgerEntry", back_populates="user")

class FarmerListing(Base):
    __tablename__ = "farmer_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    farmer_name = Column(String(120), nullable=False)
    farmer_phone = Column(String(30), nullable=False)
    commodity = Column(String(100), index=True, nullable=False)
    variety = Column(String(100), default="Standard")
    grade = Column(String(50), default="Grade A")
    quantity = Column(Float, nullable=False)
    unit = Column(String(30), default="Quintal") # Quintal, Kg, Tonne
    asking_price = Column(Float, nullable=False) # INR per unit
    harvest_date = Column(String(50), nullable=False)
    pickup_location = Column(String(200), nullable=False)
    service_area_km = Column(Float, default=25.0)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    status = Column(String(50), default="active") # active, inspection_scheduled, sold, paused
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("User", back_populates="listings")
    enquiries = relationship("MarketplaceEnquiry", back_populates="listing")

class MarketplaceEnquiry(Base):
    __tablename__ = "marketplace_enquiries"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("farmer_listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    buyer_name = Column(String(120), nullable=False)
    buyer_phone = Column(String(30), nullable=False)
    offered_price = Column(Float, nullable=False)
    requested_quantity = Column(Float, nullable=False)
    inspection_requested = Column(Boolean, default=False)
    proposed_pickup_date = Column(String(50), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="pending") # pending, accepted, rejected, inspection_scheduled, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("FarmerListing", back_populates="enquiries")
    buyer = relationship("User", back_populates="enquiries")

class MarketPriceRecord(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String(100), index=True, nullable=False)
    category = Column(String(80), index=True, nullable=False) # Cereals, Pulses, Oilseeds, Vegetables, Cash Crops
    variety = Column(String(100), default="Standard")
    state = Column(String(100), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    market = Column(String(150), index=True, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    unit = Column(String(30), default="₹/Quintal")
    observation_date = Column(String(30), index=True, nullable=False)
    source = Column(String(150), default="AGMARKNET")
    last_fetched_time = Column(String(50), default=datetime.utcnow().isoformat)

class SchemeRecord(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_key = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), index=True, nullable=False)
    department = Column(String(255), nullable=False)
    benefit = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    exclusions = Column(Text, nullable=True)
    documents = Column(JSON, nullable=False)
    how_to_apply_steps = Column(JSON, nullable=False)
    official_portal_url = Column(String(255), nullable=False)
    application_mode = Column(String(100), default="Online")
    helpline = Column(String(100), nullable=True)
    last_verified_date = Column(String(30), nullable=False)
    status = Column(String(30), default="Active")

class DiseaseDiagnosisLog(Base):
    __tablename__ = "disease_diagnosis_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop_name = Column(String(100), nullable=False)
    affected_part = Column(String(50), default="Leaf")
    predicted_disease = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)
    is_healthy = Column(Boolean, default=False)
    recommendations = Column(JSON, nullable=True)
    image_filename = Column(String(255), nullable=True)
    preferred_language = Column(String(30), default="English")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="diagnoses")

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    entry_date = Column(String(30), nullable=False)
    entry_type = Column(String(20), nullable=False) # Income, Expense
    category = Column(String(50), nullable=False) # Sales, Seeds, Fertilizer, Pesticide, Labor, Machinery, Other
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ledger_entries")
