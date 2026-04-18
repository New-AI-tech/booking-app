import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../services/ai';

// Mock the Gemini API
vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
        getGenerativeModel: () => ({
            generateContent: vi.fn().mockResolvedValue({
                response: { text: () => 'A classic black tuxedo is recommended.' }
            })
        })
    }))
}));

describe('AIService', () => {
    it('should return a generated styling recommendation', async () => {
        const response = await AIService.getStylingRecommendations('What should I wear to a gala?');
        expect(response).toBe('A classic black tuxedo is recommended.');
    });

    it('should handle aborted requests gracefully', async () => {
        const controller = new AbortController();
        controller.abort();

        await expect(
            AIService.getStylingRecommendations('Test', controller.signal)
        ).rejects.toThrow('Request aborted');
    });
});