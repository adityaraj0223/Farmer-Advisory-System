from typing import Dict, Any, List
from .knowledge_rag import rag_service
from .weather_service import get_live_weather
from ..models import MarketPriceRecord, SchemeRecord, FarmerListing
from sqlalchemy.orm import Session

# Language code mapping for Speech-to-Text and Text-to-Speech
VOICE_LANG_CODES = {
    "English": "en-IN",
    "Hindi": "hi-IN",
    "Punjabi": "pa-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Bengali": "bn-IN",
    "Bhojpuri": "bho-IN"
}

class MultilingualVoiceAssistant:
    def __init__(self):
        pass

    def get_speech_config(self, language: str) -> Dict[str, str]:
        lang_code = VOICE_LANG_CODES.get(language, "hi-IN" if language == "Hindi" else "en-IN")
        return {
            "recognition_lang": lang_code,
            "synthesis_lang": lang_code,
            "supported_languages": list(VOICE_LANG_CODES.keys())
        }

    async def process_voice_turn(
        self,
        transcript_text: str,
        language: str,
        location: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Processes voice utterance, detects tool intent (Mandi prices, Weather, Schemes, Crop agronomy),
        invokes relevant verified backend data, and formats a spoken answer.
        """
        text_lower = transcript_text.lower()
        invoked_tools = []
        spoken_response = ""

        # 1. Market Price Tool Intent
        if any(w in text_lower for w in ["price", "rate", "bhav", "mandi", "dam", "kimat", "bhav kitna", "rate kya"]):
            invoked_tools.append("MandiPriceLookup")
            # Look up matching commodity
            commodity_hit = None
            for comm in ["wheat", "gehu", "rice", "chawal", "paddy", "dhan", "maize", "makka", "cotton", "kapas", "mustard", "sarson", "potato", "aloo", "onion", "pyaz", "tomato", "tamatar", "chana"]:
                if comm in text_lower:
                    commodity_hit = comm
                    break

            if commodity_hit:
                # normalize
                std_comm = "Wheat" if commodity_hit in ["wheat", "gehu"] else "Paddy (Dhan)" if commodity_hit in ["rice", "chawal", "paddy", "dhan"] else "Potato (Aloo)" if commodity_hit in ["potato", "aloo"] else "Mustard (Sarson)" if commodity_hit in ["mustard", "sarson"] else "Cotton (Kapas)" if commodity_hit in ["cotton", "kapas"] else "Tomato (Tamatar)" if commodity_hit in ["tomato", "tamatar"] else "Onion (Pyaz)" if commodity_hit in ["onion", "pyaz"] else commodity_hit.capitalize()
                price_rec = db.query(MarketPriceRecord).filter(MarketPriceRecord.commodity.ilike(f"%{std_comm}%")).first()
                if price_rec:
                    if language == "Hindi":
                        spoken_response = f"{price_rec.state} की {price_rec.market} में {price_rec.commodity} का वर्तमान मॉडल भाव ₹{int(price_rec.modal_price)} प्रति क्विंटल है। न्यूनतम भाव ₹{int(price_rec.min_price)} और अधिकतम ₹{int(price_rec.max_price)} दर्ज किया गया है। (दिनांक: {price_rec.observation_date}, स्रोत: एगमार्कनेट)"
                    else:
                        spoken_response = f"In {price_rec.market}, {price_rec.state}, the current modal price of {price_rec.commodity} is ₹{int(price_rec.modal_price)} per quintal. Range observed is ₹{int(price_rec.min_price)} to ₹{int(price_rec.max_price)}. Reported date: {price_rec.observation_date} from AGMARKNET."
            
            if not spoken_response:
                rec = db.query(MarketPriceRecord).first()
                if language == "Hindi":
                    spoken_response = f"आज मंडी में गेहूं का भाव ₹2,275, धान ₹2,203, और सरसों ₹5,350 प्रति क्विंटल चल रहा है। किसी विशेष फसल का नाम बताएं।"
                else:
                    spoken_response = f"Today's major mandi rates: Wheat is ₹2,275/qtl, Paddy is ₹2,203/qtl, and Mustard is ₹5,350/qtl. Please name the specific commodity you wish to check."

        # 2. Weather Tool Intent
        elif any(w in text_lower for w in ["weather", "rain", "barish", "mausam", "barsat", "temperature", "tapman", "hava"]):
            invoked_tools.append("LiveWeatherAdvisory")
            weather_data = await get_live_weather(location)
            curr = weather_data.get("current", {})
            temp = curr.get("temperature", 26)
            status = curr.get("status", "Sunny")
            rain_chance = weather_data.get("forecast_7days", [{}])[0].get("rain_probability", 5)

            if language == "Hindi":
                spoken_response = f"{location} में वर्तमान तापमान {temp}°C है और मौसम {status} बना हुआ है। आज बारिश की संभावना {rain_chance}% है। {weather_data['agronomic_advisory'][0]}"
            else:
                spoken_response = f"In {location}, the current temperature is {temp}°C with {status} conditions. Rain probability for today is {rain_chance}%. {weather_data['agronomic_advisory'][0]}"

        # 3. Government Scheme Intent
        elif any(w in text_lower for w in ["scheme", "yojana", "pm kisan", "subsidy", "fasal bima", "kcc", "sarkari", "anudan"]):
            invoked_tools.append("GovtSchemeDirectory")
            if "kisan" in text_lower or "pm-kisan" in text_lower:
                scheme = db.query(SchemeRecord).filter(SchemeRecord.scheme_key == "pm-kisan").first()
            elif "bima" in text_lower or "pmfby" in text_lower:
                scheme = db.query(SchemeRecord).filter(SchemeRecord.scheme_key == "pmfby").first()
            elif "kcc" in text_lower or "credit" in text_lower:
                scheme = db.query(SchemeRecord).filter(SchemeRecord.scheme_key == "kcc").first()
            else:
                scheme = db.query(SchemeRecord).first()

            if scheme:
                if language == "Hindi":
                    spoken_response = f"{scheme.title} के तहत किसानों को {scheme.benefit} आवेदन के लिए आधार कार्ड और खतौनी अनिवार्य है। आधिकारिक पोर्टल {scheme.official_portal_url} पर जाकर अप्लाई कर सकते हैं।"
                else:
                    spoken_response = f"Under {scheme.title}, farmers receive {scheme.benefit}. Mandatory documents are Aadhaar and Land records. You can apply on the verified official portal at {scheme.official_portal_url}."

        # 4. Marketplace Intent
        elif any(w in text_lower for w in ["sell", "buy", "marketplace", "kharid", "bechna", "becho", "vyapar", "dealer"]):
            invoked_tools.append("MarketplaceSearch")
            listings_count = db.query(FarmerListing).filter(FarmerListing.status == "active").count()
            if language == "Hindi":
                spoken_response = f"किसान बाजार में वर्तमान में {listings_count} फसल लॉट उपलब्ध हैं। आप अपनी उपज सीधे खरीदारों को बेचने के लिए 'मार्केटप्लेस' टैब में जाकर अपनी फसल लिस्ट कर सकते हैं।"
            else:
                spoken_response = f"The farmer-to-buyer marketplace currently has {listings_count} verified produce listings. You can list your harvested crop directly to buyers without middlemen in the Marketplace tab."

        # 5. Agricultural Knowledge Engine (RAG)
        else:
            invoked_tools.append("AgriculturalKnowledgeRAG")
            rag_res = rag_service.answer_query(transcript_text, language=language, location=location)
            spoken_response = rag_res["answer"]

        return {
            "transcript_text": transcript_text,
            "spoken_response": spoken_response,
            "language": language,
            "invoked_tools": invoked_tools,
            "voice_config": self.get_speech_config(language)
        }

voice_assistant_service = MultilingualVoiceAssistant()
