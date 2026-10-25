import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from backend.app.main import app
from backend.app.database import engine, Base, SessionLocal
from backend.app.services.market_sync import seed_market_prices_if_empty
from backend.app.routers.schemes import seed_schemes_if_empty
from backend.app.routers.marketplace import seed_marketplace_listings_if_empty

# Initialize tables and seed data for testing
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_schemes_if_empty(db)
    seed_market_prices_if_empty(db)
    seed_marketplace_listings_if_empty(db)
finally:
    db.close()

client = TestClient(app)


def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "Krishi Mitra" in data["platform"]

def test_admin_health_and_metrics():
    res = client.get("/api/v1/admin/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True

    res_m = client.get("/api/v1/admin/metrics")
    assert res_m.status_code == 200
    metrics = res_m.json()
    assert metrics["verified_schemes"] >= 6
    assert metrics["mandi_price_records"] >= 10

def test_auth_guest_flow():
    res = client.post("/api/v1/auth/guest")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "guest"

def test_market_prices():
    res = client.get("/api/v1/market/prices")
    assert res.status_code == 200
    prices = res.json()
    assert len(prices) >= 10
    
    # Check structure
    wheat = next((p for p in prices if "wheat" in p["commodity"].lower()), None)
    assert wheat is not None
    assert wheat["modal_price"] > 0
    assert wheat["unit"] == "₹/Quintal"
    assert "observation_date" in wheat

    # Test filtering by commodity
    res_filter = client.get("/api/v1/market/prices?commodity=wheat")
    assert res_filter.status_code == 200
    filtered = res_filter.json()
    assert all("wheat" in item["commodity"].lower() for item in filtered)

def test_schemes_and_verified_links():
    res = client.get("/api/v1/schemes")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) >= 6

    # Verify PM-KISAN
    pm_kisan = next((s for s in schemes if s["scheme_key"] == "pm-kisan"), None)
    assert pm_kisan is not None
    assert "https://pmkisan.gov.in/" in pm_kisan["official_portal_url"]
    assert len(pm_kisan["how_to_apply_steps"]) >= 4

    # Test verify links endpoint
    res_links = client.get("/api/v1/schemes/verify-links/status")
    assert res_links.status_code == 200
    link_data = res_links.json()
    assert link_data["schemes_audited"] >= 6

def test_marketplace_workflow():
    # 1. List produce
    res = client.get("/api/v1/marketplace/listings")
    assert res.status_code == 200
    listings = res.json()
    assert len(listings) >= 1

    target_listing = listings[0]

    # 2. Buyer sends enquiry requesting inspection
    enquiry_payload = {
        "listing_id": target_listing["id"],
        "buyer_name": "Agro Exports Buyer",
        "buyer_phone": "+91 98111 22334",
        "offered_price": target_listing["asking_price"],
        "requested_quantity": 10.0,
        "inspection_requested": True,
        "proposed_pickup_date": "2026-04-05",
        "message": "Interested in purchasing 10 quintals upon quality verification."
    }
    res_enq = client.post("/api/v1/marketplace/enquiries", json=enquiry_payload)
    assert res_enq.status_code == 200
    enq_data = res_enq.json()
    assert enq_data["inspection_requested"] is True
    assert enq_data["status"] == "inspection_scheduled"

def test_ai_knowledge_rag_chat():
    req = {
        "query": "How to treat yellow rust in wheat?",
        "language": "English",
        "location": "Ludhiana, Punjab"
    }
    res = client.post("/api/v1/assistant/chat", json=req)
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["grounded_citations"]) > 0
    assert "IIWBR" in data["grounded_citations"][0] or "Yellow Rust" in data["grounded_citations"][0]

def test_multilingual_voice_assistant():
    req = {
        "transcript_text": "What is the mandi price of wheat?",
        "language": "English",
        "location": "Ludhiana, Punjab"
    }
    res = client.post("/api/v1/assistant/voice", json=req)
    assert res.status_code == 200
    data = res.json()
    assert "spoken_response" in data
    assert "Wheat" in data["spoken_response"]
    assert "MandiPriceLookup" in data["invoked_tools"]

def test_disease_detection_with_real_image():
    # Create test image in memory
    img = Image.new("RGB", (224, 224), color=(34, 139, 34)) # Forest green leaf-like
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    files = {"file": ("leaf.jpg", buf, "image/jpeg")}
    data = {"crop_name": "Tomato", "affected_part": "Leaf", "language": "English"}

    res = client.post("/api/v1/disease/predict", files=files, data=data)
    assert res.status_code == 200
    pred = res.json()
    assert "predicted_disease" in pred
    assert pred["confidence"] > 0.0
    assert len(pred["organic_treatment"]) > 0
    assert len(pred["chemical_treatment"]) > 0

def test_disease_detection_rejects_bad_mime():
    buf = io.BytesIO(b"fake text content")
    files = {"file": ("test.txt", buf, "text/plain")}
    res = client.post("/api/v1/disease/predict", files=files)
    assert res.status_code == 400
    assert "Unsupported file MIME type" in res.json()["detail"]
