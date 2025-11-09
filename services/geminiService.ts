
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

export async function extractTextFromFile(file: File): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(file);

  const filePart = {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };
  
  const prompt = "Extraire tout le texte lisible de ce fichier. Si c'est une image ou un PDF scanné, utilise l'OCR. Si c'est un document texte, un PDF, ou une feuille de calcul, extrais le contenu textuel de manière structurée. Ne fournis aucune explication ou formatage markdown, seulement le texte brut extrait.";

  const textPart = {
    text: prompt
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [filePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Erreur lors de l'extraction du texte via l'API Gemini:", error);
    let errorMessage = "L'extraction du texte a échoué. Veuillez réessayer.";
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            errorMessage = "La clé API n'est pas valide ou n'est pas configurée.";
        } else if (error.message.includes('429')) {
             errorMessage = "Trop de requêtes effectuées. Veuillez patienter un moment avant de réessayer.";
        }
    }
    throw new Error(errorMessage);
  }
}
