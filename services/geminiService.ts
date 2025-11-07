
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real scenario, the key is expected to be set.
  console.warn("Chave da API Gemini não encontrada. Os recursos de IA serão desativados.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateWorkoutSuggestion = async (prompt: string): Promise<string> => {
  if (!ai) return "O serviço de IA não está disponível. Por favor, configure a chave da API.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um personal trainer especialista. Crie uma sugestão de treino com base na seguinte solicitação. Forneça um plano conciso e prático. Solicitação: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar sugestão de treino:", error);
    return "Desculpe, não consegui gerar uma sugestão no momento.";
  }
};

export const generateDietSuggestion = async (prompt: string): Promise<string> => {
  if (!ai) return "O serviço de IA não está disponível. Por favor, configure a chave da API.";

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um nutricionista especialista. Crie uma sugestão de plano alimentar simples com base na seguinte solicitação. Foque em alimentos integrais e forneça uma estimativa de calorias. Solicitação: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar sugestão de dieta:", error);
    return "Desculpe, não consegui gerar uma sugestão no momento.";
  }
};