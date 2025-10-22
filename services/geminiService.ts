import { GoogleGenAI } from "@google/genai";
import { UserData, GenerationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateBio = async (userData: UserData): Promise<GenerationResult> => {
  const prompt = `
    Act as an expert Instagram bio creator. Your task is to generate 10 unique and captivating Instagram bios based on the user's details.
    You MUST learn from the top-performing, most creative, and trendy Instagram bios currently available on the internet by using your search capabilities.

    User Details:
    * Name: ${userData.name}
    * Gender: ${userData.gender}
    * Interests: ${userData.interests}

    Instructions:
    1. Generate 10 distinct bios.
    2. Each bio must include relevant emojis, cool Unicode fonts for emphasis, and keywords related to the user's interests.
    3. Keep each bio concise and well under Instagram's 150-character limit.
    4. Separate each of the 10 bios with the delimiter "|||". Do not include any other text, explanation, or numbering.

    Example Output format:
    Bio 1 text here|||Bio 2 text here|||...|||Bio 10 text here
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks ?? [];
    const text = response.text;
    
    // The model might not follow the delimiter instruction perfectly, so we handle multiple separators.
    const bios = text.split('|||').map(bio => bio.trim()).filter(bio => bio.length > 0);
    
    if (bios.length === 0) {
      // Fallback for when the model fails to generate valid bios.
      console.error("AI response was empty or incorrectly formatted:", text);
      throw new Error("The AI did not generate any bios. Please try a different prompt.");
    }
    
    return { bios, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI failed to generate a response. Please check your inputs and try again.");
  }
};