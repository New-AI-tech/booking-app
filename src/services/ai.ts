import { ENV } from '../config/env';

export const aiConfig = { key: ENV.VITE_GEMINI_API_KEY };

export const AIService = {
  generate: async (prompt: string) => {
    console.log("AI generating with key:", aiConfig.key);
    return "AI Response";
  }
};
