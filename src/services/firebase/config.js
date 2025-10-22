// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAI-Ymb0r01q681y-sOHGFu820PwY_hY58",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gioflux-83e8b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gioflux-83e8b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gioflux-83e8b.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "529181916683",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:529181916683:web:3f1a07b957ab5cc578110e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HY3V52LGG7"
};
