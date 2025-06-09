import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { VerseTranslation } from "../types";

// Initialize the GoogleGenAI client with API_KEY from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash-preview-04-17';

export const VedicTranslationService = {
  async translateVerseDetails(
    sanskritVerseText: string, 
    targetLanguageCode: string, 
    targetLanguageName: string
  ): Promise<VerseTranslation> {
    const prompt = `
You are an expert in Vedic Sanskrit and translation.
Translate the following Sanskrit verse into ${targetLanguageName} (${targetLanguageCode}).

Sanskrit Verse:
"""
${sanskritVerseText}
"""

Provide the translation in three distinct parts:
1.  "Pada (पद - Key Terms/Word Meanings)": Break down key Sanskrit words from the verse and provide their meanings in ${targetLanguageName}. If there are no specific key terms that stand out for individual analysis, provide a brief note like "No specific terms require isolated analysis; the meaning is best understood through phrase analysis."
2.  "Padartha (पदार्थ - Phrase Analysis)": Explain the meaning of important phrases or segments of the verse in ${targetLanguageName}. This should be a coherent explanation of how the parts of the verse build up its literal meaning.
3.  "Bhavartha (भावार्थ - Purport/Essence)": Give the overall essence, purport, or deeper meaning/implication of the verse in ${targetLanguageName}.

Return the result STRICTLY as a JSON object with the following structure:
{
  "pada": "Meaning of key words here, or a note if not applicable.",
  "padartha": "Explanation of phrases here.",
  "bhavartha": "Overall essence here."
}

Do not include any introductory text, concluding remarks, or markdown formatting like \`\`\`json before or after the JSON object itself.
Ensure the output for each field is a single string, suitable for direct display.
`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3, // Lower temperature for more focused and structured JSON output
        }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedTranslation = JSON.parse(jsonStr) as VerseTranslation;

      // Basic validation
      if (!parsedTranslation.padartha || !parsedTranslation.bhavartha) {
        console.error("AI response for verse translation is missing essential fields (padartha or bhavartha):", parsedTranslation);
        throw new Error("AI response for verse translation is missing essential fields (padartha or bhavartha). The 'pada' field is optional.");
      }
      if (parsedTranslation.pada === undefined) { // ensure 'pada' is at least an empty string if not provided by AI.
        parsedTranslation.pada = "";
      }


      return parsedTranslation;

    } catch (error) {
      console.error("Error translating verse with Gemini API:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to translate verse using AI: ${error.message}. Target: ${targetLanguageName}`);
      }
      throw new Error(`An unknown error occurred while translating the verse with AI. Target: ${targetLanguageName}`);
    }
  }
};
