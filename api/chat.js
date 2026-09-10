import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are ECO AI, a helpful, clear and intelligent AI assistant inside the ECO technology ecosystem."
      }
    });

    return res.status(200).json({
      reply: response.text || "I couldn't generate a response."
    });
    } catch (error) {
    console.error(
      "ECO AI Gemini Error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );

    return res.status(500).json({
      error: "ECO AI could not process your request."
    });
  }
}
