import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase app if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export { app };

export class FirebaseAuth {
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: result.user,
        data: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign up with email and password
  async signUp(email, password, displayName = null) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);

      // Update profile if display name provided
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      return {
        success: true,
        user: result.user,
        data: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return {
        success: true,
        user: result.user,
        data: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Get current user
  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({
            success: true,
            user,
            data: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            }
          });
        } else {
          resolve({ success: false, user: null });
        }
      });
    });
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      await updateProfile(user, updates);
      return {
        success: true,
        data: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Send password reset email
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        callback({
          success: true,
          user,
          data: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          }
        });
      } else {
        callback({ success: false, user: null });
      }
    });
  }
}

// Export singleton instance
export const firebaseAuth = new FirebaseAuth();
