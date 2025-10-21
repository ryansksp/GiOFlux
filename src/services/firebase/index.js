// Firebase SDK imports and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
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
export const storage = getStorage(app);

// Analytics (only in production)
let analytics;
try {
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics not available:', error);
}

export { analytics };

// Export services
export { firebaseAuth } from './auth';
export { firebaseFirestore } from './firestore';
export { firebaseStorage } from './storage';
export { firebaseConfig } from './config';

// Default export for convenience
export default {
  auth,
  db,
  storage,
  analytics,
  firebaseAuth,
  firebaseFirestore,
  firebaseStorage
};
