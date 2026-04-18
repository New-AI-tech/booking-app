import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ENV } from './config/env';

const firebaseConfig = {
  apiKey: ENV.VITE_FIREBASE_API_KEY,
  projectId: ENV.VITE_FIREBASE_PROJECT_ID,
  authDomain: `${ENV.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type OperationType = 'create' | 'read' | 'update' | 'delete' | 'list';

export function handleFirestoreError(operation: OperationType, error: any): never {
  console.error(`Firestore Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error?.message || 'Unknown error'}`);
}
