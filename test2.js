import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hi");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("error:", error.message);
  }
}
run();
