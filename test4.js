import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  const models = ["gemini-3.1-flash-live-preview"];
  for (const m of models) {
     try {
       const model = genAI.getGenerativeModel({ model: m });
       const result = await model.generateContent("hi");
       console.log(`Success with ${m}:`, result.response.text());
       break;
     } catch(e) {
       console.error(`Error with ${m}:`, e.message);
     }
  }
}
run();
