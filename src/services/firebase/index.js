// Firebase SDK imports and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase app if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export services
export { firebaseAuth } from './auth';
export { firebaseFirestore } from './firestore';
export { firebaseConfig } from './config';

// Default export for convenience
export default {
  auth,
  db,
  firebaseAuth,
  firebaseFirestore
};
