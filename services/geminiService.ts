
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real scenario, the key is expected to be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateWorkoutSuggestion = async (prompt: string): Promise<string> => {
  if (!ai) return "AI service is not available. Please configure the API key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert personal trainer. Create a workout suggestion based on the following request. Provide a concise, actionable plan. Request: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating workout suggestion:", error);
    return "Sorry, I couldn't generate a suggestion at this time.";
  }
};

export const generateDietSuggestion = async (prompt: string): Promise<string> => {
  if (!ai) return "AI service is not available. Please configure the API key.";

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert nutritionist. Create a simple meal plan suggestion based on the following request. Focus on whole foods and provide estimated calories. Request: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating diet suggestion:", error);
    return "Sorry, I couldn't generate a suggestion at this time.";
  }
};
