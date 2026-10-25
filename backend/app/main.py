from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from .config import settings
from .database import engine, Base, SessionLocal
from .routers import auth, assistant, disease, market, schemes, marketplace, weather, admin
from .services.market_sync import seed_market_prices_if_empty
from .routers.schemes import seed_schemes_if_empty
from .routers.marketplace import seed_marketplace_listings_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed initial verified datasets
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_schemes_if_empty(db)
        seed_market_prices_if_empty(db)
        seed_marketplace_listings_if_empty(db)
    finally:
        db.close()
    print("[KrishiMitra API] System ready. All database tables and verified datasets initialized.")
    yield
    print("[KrishiMitra API] Shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI Farming Platform API: Crop Disease CV Model, Multilingual Voice Assistant, Mandi Prices, Verified Schemes, and Farmer-to-Buyer Direct Marketplace.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for development across Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded images static path
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(disease.router, prefix=settings.API_V1_STR)
app.include_router(market.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(marketplace.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

import os
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

from fastapi import HTTPException

if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path == "docs" or full_path == "openapi.json":
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": "Krishi Mitra AI (Kisan Sahayak)",
            "version": "2.0.0",
            "docs_url": "/docs",
            "api_v1": settings.API_V1_STR,
            "status": "online"
        }
