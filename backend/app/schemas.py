from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=4)
    role: str = "farmer"
    preferred_language: str = "English"
    location: str = "Ludhiana, Punjab"
    farm_size_acres: Optional[float] = 5.0
    primary_crops: Optional[str] = "Wheat, Rice"

class UserLogin(BaseModel):
    identifier: str # phone or email or name
    password: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfile(BaseModel):
    id: int
    name: str
    role: str
    phone: Optional[str]
    email: Optional[str]
    preferred_language: str
    location: str
    farm_size_acres: Optional[float]
    primary_crops: Optional[str]

    class Config:
        from_attributes = True

# --- Marketplace Schemas ---
class ListingCreate(BaseModel):
    commodity: str = Field(..., min_length=2)
    variety: str = "Standard"
    grade: str = "Grade A"
    quantity: float = Field(..., gt=0)
    unit: str = "Quintal" # Quintal, Kg, Tonne
    asking_price: float = Field(..., gt=0)
    harvest_date: str
    pickup_location: str
    service_area_km: Optional[float] = 25.0
    description: Optional[str] = None
    image_url: Optional[str] = None

class ListingUpdate(BaseModel):
    asking_price: Optional[float] = None
    quantity: Optional[float] = None
    status: Optional[str] = None # active, paused, sold, inspection_scheduled

class ListingResponse(BaseModel):
    id: int
    farmer_id: Optional[int]
    farmer_name: str
    farmer_phone: str
    commodity: str
    variety: str
    grade: str
    quantity: float
    unit: str
    asking_price: float
    harvest_date: str
    pickup_location: str
    service_area_km: float
    description: Optional[str]
    image_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class EnquiryCreate(BaseModel):
    listing_id: int
    buyer_name: str
    buyer_phone: str
    offered_price: float
    requested_quantity: float
    inspection_requested: bool = False
    proposed_pickup_date: Optional[str] = None
    message: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: int
    listing_id: int
    buyer_id: Optional[int]
    buyer_name: str
    buyer_phone: str
    offered_price: float
    requested_quantity: float
    inspection_requested: bool
    proposed_pickup_date: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Market Price Schemas ---
class MarketPriceItem(BaseModel):
    id: int
    commodity: str
    category: str
    variety: str
    state: str
    district: str
    market: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str
    observation_date: str
    source: str
    last_fetched_time: str

    class Config:
        from_attributes = True

class MarketPriceHistory(BaseModel):
    commodity: str
    history: List[Dict[str, Any]]

# --- Govt Schemes Schemas ---
class SchemeResponse(BaseModel):
    id: int
    scheme_key: str
    title: str
    category: str
    department: str
    benefit: str
    eligibility: str
    exclusions: Optional[str]
    documents: List[str]
    how_to_apply_steps: List[str]
    official_portal_url: str
    application_mode: str
    helpline: Optional[str]
    last_verified_date: str
    status: str

    class Config:
        from_attributes = True

# --- Disease Diagnosis Schemas ---
class DiseasePredictionResponse(BaseModel):
    crop_name: str
    affected_part: str
    predicted_disease: str
    confidence: float
    confidence_percentage: str
    is_healthy: bool
    alternative_diagnoses: List[Dict[str, Any]]
    organic_treatment: List[str]
    chemical_treatment: List[str]
    prevention_steps: List[str]
    favorable_conditions: Optional[str]
    source_reference: str
    model_version: str

# --- Assistant & Voice Schemas ---
class ChatRequest(BaseModel):
    query: str
    language: str = "English"
    conversation_history: Optional[List[Dict[str, str]]] = None
    location: Optional[str] = "Ludhiana, Punjab"
    crop_context: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    language: str
    grounded_citations: List[str] = []
    invoked_tools: List[str] = []

class VoiceProcessRequest(BaseModel):
    audio_base64: Optional[str] = None
    transcript_text: Optional[str] = None
    language: str = "Hindi"
    location: Optional[str] = "Ludhiana, Punjab"

# --- Financial Ledger Schemas ---
class LedgerCreate(BaseModel):
    entry_date: str
    entry_type: str # Income, Expense
    category: str
    description: str
    amount: float

class LedgerResponse(BaseModel):
    id: int
    entry_date: str
    entry_type: str
    category: str
    description: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True
