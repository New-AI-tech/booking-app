 main
export const ENV = {
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
};

import { z } from 'zod';

const envSchema = z.object({
    VITE_GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
    VITE_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
    VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase Auth Domain is required"),
    VITE_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
    VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase Storage Bucket is required"),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase Messaging Sender ID is required"),
    VITE_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),
    VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1, "Firebase Measurement ID is required"),
    VITE_SUPABASE_URL: z.string().url("Supabase URL must be a valid URL").optional(),
    VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format());
    throw new Error("Missing required environment variables. Check your .env file.");
}

export const ENV = parsedEnv.data;
 main
