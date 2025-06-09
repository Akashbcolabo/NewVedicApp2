

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the GoogleGenAI client with API_KEY from process.env
// Assuming process.env.API_KEY is pre-configured and valid as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const geminiModelName = 'gemini-2.5-flash-preview-04-17';

export const DeepSeekService = {
  async initialize(): Promise<void> {
    // Placeholder for any initialization logic if needed in the future
    console.log("AI Service (Gemini Wrapper) Initialized.");
  },

  async chat(messages: ChatMessage[], languageName: string): Promise<ChatMessage> {
    // Removed explicit API_KEY check; relying on SDK initialization and try/catch for errors if API_KEY is missing/invalid.
    // The previous check for API_KEY would return a specific error message. Now, if process.env.API_KEY is not set,
    // the ai.models.generateContent call will fail, and the catch block below will handle it.

    const userMessagesContent = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join('\nUser: ');

    const systemInstruction = `You are a helpful and knowledgeable Vedic assistant from the Arya Kalyan Foundation. Your goal is to provide insightful and accurate information related to Vedic wisdom, scriptures, philosophy, practices, and culture.
Respond in ${languageName}. Be respectful and clear in your answers.
If the user asks about something unrelated to Vedic knowledge or your purpose, politely decline to answer and guide them back to relevant topics.
Current conversation with user (last message is the newest):
User: ${userMessagesContent}`;

    try {
      // Simulate a small chance of using "DeepSeek" for demonstration, otherwise use Gemini
      const useDeepSeekMock = Math.random() < 0.1; // 10% chance to mock DeepSeek

      if (useDeepSeekMock && messages.length > 0) {
        // Mock DeepSeek response
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
        let mockResponseContent = `(DeepSeek Mock) I understand you're asking about: "${lastUserMessage}". I am still learning about this topic in ${languageName}.`;
        if (lastUserMessage.includes("namaste") || lastUserMessage.includes("hello")) {
            mockResponseContent = `(DeepSeek Mock) Namaste! How can I assist you with Vedic knowledge today in ${languageName}?`;
        }

        return {
          role: 'assistant',
          content: mockResponseContent,
          provider: 'deepseek'
        };
      }

      // Use Gemini API
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: geminiModelName,
        contents: messages[messages.length -1].content, // Send only the last user message as primary content
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      const aiResponseText = response.text;

      if (!aiResponseText) {
        throw new Error('Received an empty response from Gemini API.');
      }

      return {
        role: 'assistant',
        content: aiResponseText,
        provider: 'gemini'
      };

    } catch (error) {
      console.error("Error communicating with AI service (Gemini):", error);
      let errorMessage = `Sorry, I encountered an issue and cannot respond at the moment. Please try again later. (Error in ${languageName})`;
      if (error instanceof Error) {
        errorMessage = `AI Service Error in ${languageName}: ${error.message}. Please try again.`;
      }
      return {
        role: 'assistant',
        content: errorMessage,
        provider: 'gemini'
      };
    }
  }
};