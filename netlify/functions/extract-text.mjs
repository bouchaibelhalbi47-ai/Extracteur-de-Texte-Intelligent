import { GoogleGenAI } from "@google/genai";

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables");
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server configuration error: API Key is missing." }),
    };
  }

  try {
    const { base64Data, mimeType } = JSON.parse(event.body);

    if (!base64Data || !mimeType) {
      return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: 'Missing base64Data or mimeType' }) };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };
    
    const prompt = "Extraire tout le texte lisible de ce fichier. Si c'est une image ou un PDF scanné, utilise l'OCR. Si c'est un document texte, un PDF, ou une feuille de calcul, extrais le contenu textuel de manière structurée. Ne fournis aucune explication ou formatage markdown, seulement le texte brut extrait.";

    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [filePart, textPart] },
    });

    const text = response.text;
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };

  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Failed to extract text from file.' }),
    };
  }
};
