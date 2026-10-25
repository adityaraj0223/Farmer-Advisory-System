# Krishi Mitra AI (Kisan Sahayak) — Smart Agricultural Ecosystem

Production-grade AI-powered agricultural advisory platform designed for Indian farmers. Integrates computer vision crop disease detection, multilingual voice interaction, real Mandi market prices (AGMARKNET), verified government schemes, live weather & spraying advisories, and a farmer-to-buyer direct procurement marketplace.

---

## 🌾 System Architecture

```text
Farmer system/
├── backend/                             # Python FastAPI REST API & ML Engine
│   ├── app/
│   │   ├── main.py                     # App entry point, CORS, and Lifespan seeding
│   │   ├── config.py                   # Environment settings
│   │   ├── database.py                 # SQLAlchemy SQLite / PostgreSQL connection
│   │   ├── models.py                   # DB Entities: Users, Listings, Enquiries, MandiPrices, Schemes
│   │   ├── schemas.py                  # Pydantic validation schemas
│   │   ├── auth.py                     # JWT token generator, password hashing, get_current_user
│   │   ├── routers/                    # Endpoints (/auth, /assistant, /disease, /market, /schemes, /marketplace, /weather, /admin)
│   │   └── services/
│   │       ├── knowledge_rag.py        # ICAR-grounded Agronomic RAG retrieval service
│   │       ├── ml_disease_detector.py  # MobileNet-V3 plant disease inference engine
│   │       ├── market_sync.py          # AGMARKNET mandi price data sync & history
│   │       ├── weather_service.py      # Live weather & agronomic spray advisory
│   │       └── voice_service.py        # Multilingual voice intent & synthesis processor
│   ├── data/
│   │   ├── verified_schemes.json       # Official government scheme directory
│   │   ├── market_prices_seed.json     # Verified Mandi prices with observation dates
│   │   └── knowledge_base.json         # Grounded ICAR crop, disease, and soil guidance
│   ├── ml/
│   │   ├── dataset_prep.py             # Dataset inventory, quality validation & split
│   │   ├── train_disease_model.py      # Reproducible PyTorch training script
│   │   ├── evaluate_model.py           # Per-class Precision, Recall, F1 evaluation report
│   │   └── model_weights/              # Saved model weights (`plant_disease_mobilenet_v3.pth`)
│   ├── tests/
│   │   └── test_api.py                 # Automated unit and integration test suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/                            # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceAssistant.jsx      # Multilingual AI Voice Assistant (Replaces Expert Connect)
│   │   │   ├── DiseaseDiagnosis.jsx    # Real PyTorch MobileNet-V3 disease diagnosis
│   │   │   ├── MarketPrices.jsx        # Verified Mandi market prices & trend visualizer
│   │   │   ├── GovtSchemes.jsx         # Scheme directory with verified Apply Now links
│   │   │   ├── FarmerMarketplace.jsx   # Farmer harvest listing & buyer direct procurement
│   │   │   └── WeatherAdvisory.jsx     # Live meteorological & spray window advisory
│   │   ├── services/
│   │   │   └── api.js                  # Centralized API service layer
│   │   ├── App.jsx                     # Core application layout, navigation & state
│   │   ├── Auth.jsx                    # Mobile authentication & guest demo mode
│   │   └── index.css                   # Tailwind CSS styling & design system
│   └── package.json
```

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI + PyTorch)
```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run automated tests
pytest tests/test_api.py -v

# Start the backend server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend API interactive documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend UI will be running at: `http://localhost:5173/Farmer-Advisory-System/`

---

## 🧪 Verified Feature Deliverables

| Module | Verification Status | Details |
|---|---|---|
| **AI Voice Assistant** | **PASS — Verified Working** | Replaced external WhatsApp officer redirect with a first-party multilingual voice assistant supporting Hindi, English, Punjabi, Marathi, Gujarati, etc. Features Web Speech API recognition, animated waveform, backend tool calling, and text-to-speech audio playback. |
| **Crop Disease Diagnosis** | **PASS — Verified Working** | Powered by PyTorch MobileNet-V3 model (`plant_disease_mobilenet_v3.pth`). Accepts crop photos, detects 12 agricultural conditions, validates image quality/blur, and provides calibrated confidence with ICAR organic/chemical remedies. |
| **Daily Mandi Prices** | **PASS — Verified Working** | Sourced from verified AGMARKNET wholesale records. Preserves observation date, mandi name, commodity, variety, min/max/modal prices in `₹/Quintal`, and historical trend charting. |
| **Government Schemes** | **PASS — Verified Working** | Detailed modal for PM-KISAN, PMFBY, KCC, PMKSY, e-NAM, and PKVY. Displays verified eligibility, mandatory documents, scheme-specific numbered steps, and working "Apply Now" buttons opening official `.gov.in` destinations. |
| **Farmer-to-Buyer Marketplace** | **PASS — Verified Working** | Farmers list harvested produce with quantities, asking prices, and pickup points. Buyers search, filter, and send procurement inquiries with a farm-gate quality inspection toggle. Preserves seed and machinery rental catalogs. |
| **Weather & Crop Advisory** | **PASS — Verified Working** | Live meteorological telemetry (temperature, humidity, wind velocity, rain risk, 7-day outlook) paired with localized agronomic spray and irrigation recommendations. |
| **Authentication & Profiles** | **PASS — Verified Working** | Supports guest demo mode, phone/email login, profile management, and localStorage fallback. |
| **Financial Farm Ledger** | **PASS — Verified Working** | Preserved local revenue/expense tracker with net profit calculation and entry logging. |
