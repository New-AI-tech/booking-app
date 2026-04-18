import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ENV } from './config/env';

const firebaseConfig = {
  apiKey: ENV.VITE_FIREBASE_API_KEY,
  projectId: ENV.VITE_FIREBASE_PROJECT_ID,
  authDomain: `${ENV.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const login = async () => console.log("Login triggered");
export const logout = async () => console.log("Logout triggered");

export const OperationType = {
  CREATE: 'create', READ: 'read', UPDATE: 'update', DELETE: 'delete', LIST: 'list'
} as const;

export function handleFirestoreError(operation: any, error: any, context?: any): never {
  console.error(`Firestore Error [${operation}]:`, error, context || '');
  throw new Error(`Operation failed: ${error?.message || 'Unknown error'}`);
}
