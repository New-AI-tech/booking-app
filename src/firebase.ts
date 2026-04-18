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

// Converted from a TS Type to a runtime object/enum to satisfy Manus
export const OperationType = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list'
} as const;

// Expanded to accept 3 arguments since Manus is passing extra context
export function handleFirestoreError(operation: any, error: any, context?: any): never {
  console.error(`Firestore Error [${operation}]:`, error, context || '');
  throw new Error(`Operation failed: ${error?.message || 'Unknown error'}`);
}
