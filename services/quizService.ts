

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Quiz, QuizQuestion } from "../types";

// Initialize the GoogleGenAI client with API_KEY from process.env
// Assuming process.env.API_KEY is pre-configured and valid as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash-preview-04-17';

export const QuizService = {
  async generateQuiz(topic: string, difficulty: Quiz['difficulty']): Promise<Quiz> {
    const prompt = `
You are a quiz generator specializing in Vedic knowledge.
Generate a 5-question multiple-choice quiz about "${topic}" with "${difficulty}" difficulty.
Return the quiz as a JSON object with the following structure:
{
  "id": "string (generate a unique ID based on topic, difficulty, and timestamp, e.g., '${topic.toLowerCase().replace(/\s+/g, '-')}-${difficulty.toLowerCase()}-${Date.now()}')",
  "title": "string (e.g., '${topic} Quiz (${difficulty})')",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "string (unique question ID, e.g., 'q1')",
      "text": "string (question text)",
      "options": ["string (option 1)", "string (option 2)", "string (option 3)", "string (option 4)"],
      "correctAnswerIndex": "number (0-3, index of the correct option in the options array)"
    }
    // ... (4 more questions)
  ]
}
Ensure the response is ONLY the JSON object. Do not include any other text, markdown formatting like \`\`\`json, or explanations.
The questions should be relevant to the topic and difficulty level.
`;
    // Removed explicit API_KEY check; relying on SDK initialization and try/catch for errors if API_KEY is missing/invalid.
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // temperature: 0.5, // Lower temperature for more predictable JSON structure
        }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedQuiz = JSON.parse(jsonStr) as Quiz;

      // Basic validation
      if (!parsedQuiz.title || !parsedQuiz.questions || parsedQuiz.questions.length !== 5) {
        console.error("AI response for quiz is malformed or incomplete:", parsedQuiz);
        throw new Error("AI response for quiz is malformed or incomplete.");
      }
      parsedQuiz.questions.forEach((q, index) => {
        if (!q.id) q.id = `q${index + 1}`; // Ensure question IDs exist
        if (q.options.length !== 4 || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
            console.error("Malformed question options/answer:", q);
            throw new Error(`Malformed options/answer for question: ${q.text}`);
        }
      });
      if (!parsedQuiz.id) { // Ensure quiz ID exists
        parsedQuiz.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${difficulty.toLowerCase()}-${Date.now()}`;
      }
      if(!parsedQuiz.difficulty) parsedQuiz.difficulty = difficulty;


      return parsedQuiz;

    } catch (error) {
      console.error("Error generating quiz with Gemini API:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate quiz using AI: ${error.message}`);
      }
      throw new Error("An unknown error occurred while generating the quiz with AI.");
    }
  }
};