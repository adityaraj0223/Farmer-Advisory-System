import json
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
from ..config import settings

class KnowledgeRAGService:
    def __init__(self):
        self.kb_file = settings.DATA_DIR / "knowledge_base.json"
        self.documents: List[Dict[str, Any]] = []
        self._load_documents()

    def _load_documents(self):
        if self.kb_file.exists():
            with open(self.kb_file, "r", encoding="utf-8") as f:
                self.documents = json.load(f)
        else:
            self.documents = []

    def retrieve(self, query: str, top_k: int = 3) -> List[Tuple[Dict[str, Any], float]]:
        """
        Ranks knowledge base documents using tokenized keyword-overlap and weighted agricultural metadata.
        """
        if not self.documents:
            return []

        clean_query = query.lower()
        query_tokens = set(re.findall(r'\b\w+\b', clean_query))

        scores = []
        for doc in self.documents:
            score = 0.0
            doc_crop = doc.get("crop", "").lower()
            doc_topic = doc.get("topic", "").lower()
            doc_symptoms = doc.get("symptoms", "").lower()
            doc_prevention = " ".join(doc.get("prevention_and_treatment", [])).lower()
            doc_organic = " ".join(doc.get("organic_treatment", [])).lower()

            full_text = f"{doc_crop} {doc_topic} {doc_symptoms} {doc_prevention} {doc_organic}"
            doc_tokens = set(re.findall(r'\b\w+\b', full_text))

            overlap = query_tokens.intersection(doc_tokens)
            score += len(overlap) * 2.0

            # Boost if query explicitly mentions the crop
            if doc_crop and doc_crop in clean_query:
                score += 5.0

            # Boost if query mentions disease or pest specifically
            for topic_word in doc_topic.split():
                if len(topic_word) > 3 and topic_word in clean_query:
                    score += 4.0

            if score > 0:
                scores.append((doc, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

    def answer_query(self, query: str, language: str = "English", location: str = "Ludhiana, Punjab") -> Dict[str, Any]:
        retrieved = self.retrieve(query, top_k=2)

        citations = []
        if retrieved:
            top_doc, score = retrieved[0]
            citations.append(f"{top_doc.get('topic')} (Source: {top_doc.get('source')})")

            # Format answer grounded in retrieved facts
            topic = top_doc.get("topic")
            crop = top_doc.get("crop")
            symptoms = top_doc.get("symptoms")
            prevention = top_doc.get("prevention_and_treatment", [])
            organic = top_doc.get("organic_treatment", [])
            source = top_doc.get("source")

            if language.lower().startswith("hi"):
                # Hindi structured response
                lines = [
                    f"**विषय: {topic} ({crop})**",
                    f"\n**पहचान एवं लक्षण:**\n{symptoms}",
                    "\n**प्रमाणित समाधान एवं उपचार (ICAR अनुशंसा):**"
                ]
                for step in prevention:
                    lines.append(f"• {step}")
                if organic:
                    lines.append("\n**जैविक एवं देसी विकल्प:**")
                    for org in organic:
                        lines.append(f"• {org}")
                lines.append(f"\n*(स्रोत: {source} | स्थान संदर्भ: {location})*")
                answer = "\n".join(lines)
            elif language.lower().startswith("pa"):
                # Punjabi structured response
                lines = [
                    f"**ਵਿਸ਼ਾ: {topic} ({crop})**",
                    f"\n**ਲੱਛਣ:**\n{symptoms}",
                    "\n**ਸਿਫ਼ਾਰਸ਼ ਕੀਤੇ ਇਲਾਜ (ICAR):**"
                ]
                for step in prevention:
                    lines.append(f"• {step}")
                if organic:
                    lines.append("\n**ਜੈਵਿਕ ਹੱਲ:**")
                    for org in organic:
                        lines.append(f"• {org}")
                lines.append(f"\n*(ਸਰੋਤ: {source})*")
                answer = "\n".join(lines)
            else:
                # English structured response
                lines = [
                    f"**Topic: {topic} ({crop})**",
                    f"\n**Identification & Symptoms:**\n{symptoms}",
                    "\n**Recommended Action Plan & Treatments (ICAR / Research Grounded):**"
                ]
                for step in prevention:
                    lines.append(f"• {step}")
                if organic:
                    lines.append("\n**Organic & Biological Alternatives:**")
                    for org in organic:
                        lines.append(f"• {org}")
                lines.append(f"\n*Source: {source} (Tailored for {location})*")
                answer = "\n".join(lines)
        else:
            # Fallback general agricultural agronomy guidance
            citations.append("ICAR National Agronomy Advisory Guidelines")
            if language.lower().startswith("hi"):
                answer = (
                    f"नमस्ते किसान मित्र! आपके प्रश्न '{query}' के संदर्भ में:\n\n"
                    f"1. फसल एवं मिट्टी की सटीक जांच कराएं ताकि सही पोषक तत्व संतुलन (NPK) बना रहे।\n"
                    f"2. किसी भी कीट या रोग के शुरुआती लक्षण दिखने पर नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें या जैविक नीम तेल (1500 ppm) का छिड़काव करें।\n"
                    f"3. असत्यापित या अत्यधिक कीटनाशक दवाओं के प्रयोग से बचें।\n\n"
                    f"कृपया विशिष्ट फसल, पौधे की आयु या रोग के लक्षणों की अधिक जानकारी साझा करें ताकि हम सटीक मार्गदर्शन प्रदान कर सकें।"
                )
            else:
                answer = (
                    f"Hello! Regarding your query on '{query}':\n\n"
                    f"1. Ensure balanced soil nutrition (NPK) based on your recent Soil Health Card.\n"
                    f"2. For pest and fungal prevention, maintain adequate plant spacing and apply neem oil (1500 ppm) @ 5ml/liter during early vegetative stages.\n"
                    f"3. Avoid unverified chemical combinations without consulting your local Krishi Vigyan Kendra (KVK).\n\n"
                    f"Please share your specific crop name, plant age, and visual symptoms so I can provide precise, grounded guidance."
                )

        return {
            "answer": answer,
            "language": language,
            "grounded_citations": citations,
            "invoked_tools": ["AgriculturalKnowledgeRAG"]
        }

rag_service = KnowledgeRAGService()
