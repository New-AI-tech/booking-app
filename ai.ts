import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';

const genAI = new GoogleGenerativeAI(ENV.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const AIService = {
    async getStylingRecommendations(prompt: string, signal?: AbortSignal): Promise<string> {
        try {
            if (signal?.aborted) throw new Error('Request aborted');

            // The @google/generative-ai SDK does not directly support AbortSignal in generateContent
            // We handle it manually at the start of the function.
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('AI Service Error:', error);
            throw new Error(error.message || 'Failed to generate recommendations');
        }
    }
};
