import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface TranslateParams {
  sourceText: string;
  targetLanguageCode: string; // e.g., 'en', 'bn'
  targetLanguageName: string; // e.g., 'English', 'Bengali'
  sourceLanguageCode?: string; // Optional: e.g., 'en', 'bn'
  sourceLanguageName?: string; // Optional
}

interface TranslateResult {
  translatedText: string;
  detectedSourceLanguageCode?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-preview-04-17';

export const TranslationService = {
  async translate({ 
    sourceText, 
    targetLanguageCode, 
    targetLanguageName, 
    sourceLanguageCode, 
    sourceLanguageName 
  }: TranslateParams): Promise<TranslateResult> {
    if (!sourceText.trim()) {
      return { translatedText: '' };
    }

    const prompt = `Translate the following text from ${sourceLanguageName || 'the source language'} to ${targetLanguageName} (${targetLanguageCode}).
Text to translate:
"""
${sourceText}
"""
Return ONLY the translated text, without any additional explanations, introductory phrases, or markdown.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          // Temperature can be adjusted. Lower for more literal, higher for more creative.
          // temperature: 0.3, 
        }
      });

      const translatedText = response.text.trim();
      
      if (!translatedText) {
        // This might happen if the model returns an empty response or fails silently
        throw new Error('AI returned an empty translation.');
      }

      return {
        translatedText: translatedText,
        detectedSourceLanguageCode: sourceLanguageCode || 'auto' // 'auto' if not provided, Gemini doesn't explicitly return detected source lang in this mode.
      };

    } catch (error) {
      console.error(`Error translating text to ${targetLanguageName} using Gemini API:`, error);
      if (error instanceof Error) {
          throw new Error(`Failed to translate to ${targetLanguageName}: ${error.message}`);
      }
      throw new Error(`An unknown error occurred while translating to ${targetLanguageName}.`);
    }
  }
};