import { z } from 'zod';

const envSchema = z.object({
    VITE_GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
    VITE_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
    VITE_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format());
    throw new Error("Missing required environment variables. Check your .env file.");
}

export const ENV = parsedEnv.data;