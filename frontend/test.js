import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = "AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ";

async function run() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("error:", error.message);
  }
}
run();
