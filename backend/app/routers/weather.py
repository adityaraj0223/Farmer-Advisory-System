from fastapi import APIRouter, Query
from ..services.weather_service import get_live_weather

router = APIRouter(prefix="/weather", tags=["Weather Advisory"])

@router.get("")
async def get_weather(location: str = Query("Ludhiana, Punjab")):
    data = await get_live_weather(location)
    return data
