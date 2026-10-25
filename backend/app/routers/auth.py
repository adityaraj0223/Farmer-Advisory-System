from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, TokenResponse, UserProfile
from ..auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if user_in.email:
        existing = db.query(User).filter(User.email == user_in.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
    if user_in.phone:
        existing = db.query(User).filter(User.phone == user_in.phone).first()
        if existing:
            raise HTTPException(status_code=400, detail="An account with this phone already exists.")

    hashed_pw = get_password_hash(user_in.password) if user_in.password else None
    user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_pw,
        role=user_in.role,
        preferred_language=user_in.preferred_language,
        location=user_in.location,
        farm_size_acres=user_in.farm_size_acres or 5.0,
        primary_crops=user_in.primary_crops or "Wheat, Rice"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "phone": user.phone,
            "email": user.email,
            "preferred_language": user.preferred_language,
            "location": user.location,
            "farm_size_acres": user.farm_size_acres
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    ident = login_in.identifier.strip()
    user = db.query(User).filter((User.email == ident) | (User.phone == ident) | (User.name == ident)).first()
    
    if not user:
        # Create user automatically for phone/demo login to ensure frictionless farmer onboarding
        user = User(
            name=ident if "@" not in ident else ident.split("@")[0].capitalize(),
            phone=ident if "@" not in ident and ident.replace("+", "").isdigit() else "+91 98765 43210",
            email=ident if "@" in ident else None,
            role="farmer",
            location="Ludhiana, Punjab"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.hashed_password and login_in.password:
        if not verify_password(login_in.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect credentials.")

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "phone": user.phone,
            "email": user.email,
            "preferred_language": user.preferred_language,
            "location": user.location,
            "farm_size_acres": user.farm_size_acres
        }
    }

@router.post("/guest", response_model=TokenResponse)
def guest_login(db: Session = Depends(get_db)):
    guest = db.query(User).filter(User.role == "guest").first()
    if not guest:
        guest = User(
            name="Demo Farmer (Kisan)",
            phone="+91 90000 00000",
            email="guest@krishimitra.ai",
            role="guest",
            location="Ludhiana, Punjab",
            farm_size_acres=8.5,
            primary_crops="Wheat, Sugarcane"
        )
        db.add(guest)
        db.commit()
        db.refresh(guest)

    token = create_access_token({"sub": str(guest.id), "role": "guest", "name": guest.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": guest.id,
            "name": guest.name,
            "role": "guest",
            "phone": guest.phone,
            "email": guest.email,
            "preferred_language": guest.preferred_language,
            "location": guest.location,
            "farm_size_acres": guest.farm_size_acres
        }
    }

@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return current_user
