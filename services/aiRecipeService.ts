

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Recipe } from "../types";

// Initialize the GoogleGenAI client with API_KEY from process.env
// Assuming process.env.API_KEY is pre-configured and valid as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-preview-04-17';

export const AIRecipeService = {
  async generateRecipe(userPrompt: string): Promise<Recipe> {
    const prompt = `You are a culinary assistant. Generate a recipe based on the following user prompt.
User prompt: '${userPrompt}'
Return the recipe as a JSON object with the following structure:
{
  "id": "string (generate a unique ID based on prompt keywords and current timestamp, e.g., 'healthy-oats-fruits-recipe-1678886400000')",
  "name": "string (recipe name)",
  "category": "string (e.g., 'sattvic', 'ayurvedic', 'breakfast', 'dessert', 'general' - infer if possible or use 'general')",
  "ingredients": ["string (list of ingredients with quantities if appropriate)"],
  "instructions": ["string (step-by-step instructions)"],
  "imageUrl": "string (suggest a relevant Unsplash.com search query, like 'photo of delicious pasta dish' or provide a generic placeholder like 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60' if unsure)",
  "cookingTime": "string (e.g., '30 mins')",
  "difficulty": "string (e.g., 'Easy', 'Medium', 'Hard')",
  "cuisine": "string (e.g., 'Vedic', 'Indian', 'Italian', 'General')"
}
Ensure the response is ONLY the JSON object. Do not include any other text, markdown formatting like \`\`\`json, or explanations.`;

    // Removed explicit API_KEY check; relying on SDK initialization and try/catch for errors if API_KEY is missing/invalid.
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // thinkingConfig: { thinkingBudget: 0 } // Might disable thinking for faster, potentially less creative, JSON structure. Test this.
        }
      });

      let jsonStr = response.text.trim();
      
      // Remove markdown fence if present
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedRecipe = JSON.parse(jsonStr) as Recipe;

      // Basic validation (can be more thorough)
      if (!parsedRecipe.name || !parsedRecipe.ingredients || !parsedRecipe.instructions) {
        throw new Error("AI response missing essential recipe fields.");
      }
      if (!parsedRecipe.id) { // Ensure ID exists
        parsedRecipe.id = `${userPrompt.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      }
      if (!parsedRecipe.imageUrl) {
        parsedRecipe.imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'; // Default placeholder
      }


      return parsedRecipe;

    } catch (error) {
      console.error("Error generating recipe with Gemini API:", error);
      if (error instanceof Error) {
          throw new Error(`Failed to generate recipe using AI: ${error.message}`);
      }
      throw new Error("An unknown error occurred while generating the recipe with AI.");
    }
  }
};