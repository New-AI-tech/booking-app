import { app as rootApp, OperationType, handleFirestoreError } from '../firebase';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const v2App = initializeApp(rootApp.options, 'v2-bridge');
const db = initializeFirestore(v2App, {
  experimentalAutoDetectLongPolling: true
});
const auth = getAuth(v2App);

export { db, auth, OperationType, handleFirestoreError };
