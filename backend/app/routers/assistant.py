from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import ChatRequest, ChatResponse, VoiceProcessRequest
from ..services.knowledge_rag import rag_service
from ..services.voice_service import voice_assistant_service

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    result = rag_service.answer_query(
        query=req.query,
        language=req.language,
        location=req.location or "Ludhiana, Punjab"
    )
    return ChatResponse(
        answer=result["answer"],
        language=result["language"],
        grounded_citations=result["grounded_citations"],
        invoked_tools=result["invoked_tools"]
    )

@router.post("/voice")
async def process_voice(req: VoiceProcessRequest, db: Session = Depends(get_db)):
    transcript = req.transcript_text or "आज गेहूं का भाव क्या है?"
    result = await voice_assistant_service.process_voice_turn(
        transcript_text=transcript,
        language=req.language or "Hindi",
        location=req.location or "Ludhiana, Punjab",
        db=db
    )
    return result

@router.get("/voice-config")
def get_voice_languages():
    return {
        "supported_languages": [
            {"name": "Hindi", "code": "hi-IN", "native": "हिन्दी"},
            {"name": "English", "code": "en-IN", "native": "English"},
            {"name": "Punjabi", "code": "pa-IN", "native": "ਪੰਜਾਬੀ"},
            {"name": "Marathi", "code": "mr-IN", "native": "मराठी"},
            {"name": "Gujarati", "code": "gu-IN", "native": "ગુજરાતી"},
            {"name": "Tamil", "code": "ta-IN", "native": "தமிழ்"},
            {"name": "Telugu", "code": "te-IN", "native": "తెలుగు"},
            {"name": "Bengali", "code": "bn-IN", "native": "বাংলা"},
            {"name": "Bhojpuri", "code": "bho-IN", "native": "भोजपुरी"}
        ]
    }
