import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Act as an expert agricultural advisor. The farmer wants to know everything about the "PM-KISAN" scheme in India.
      Please provide comprehensive, highly accurate details including:
      1. Full Name & Purpose
      2. Key Benefits
      3. Eligibility Criteria
      4. Required Documents
      5. Step-by-step How to Apply (including official portal link if known)
      
      IMPORTANT: Respond entirely in English language. Use clear headings and bullet points.`;
      
    const result = await model.generateContent(prompt);
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("error:", error.message);
  }
}
run();
