import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  getAuth
} from "firebase/auth";
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from './config';
import { firebaseFirestore } from './firestore';

// Inicializa Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);

export class FirebaseAuth {
  constructor() {
    this.auth = auth;
  }

  // Login
  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = this.#mapUserData(result.user);
      return { success: true, user: result.user, data: userData };
    } catch (error) {
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        return { success: false, error: 'Este email não está cadastrado. Crie uma conta primeiro.', code: error.code };
      } else if (error.code === 'auth/wrong-password') {
        return { success: false, error: 'Senha incorreta. Tente novamente.', code: error.code };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Email inválido.', code: error.code };
      } else if (error.code === 'auth/user-disabled') {
        return { success: false, error: 'Esta conta foi desativada.', code: error.code };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Muitas tentativas de login. Tente novamente mais tarde.', code: error.code };
      } else {
        return { success: false, error: error.message, code: error.code };
      }
    }
  }

  // Cadastro
  async signUp(email, password, userData = {}) {
    try {
      console.log('Starting signup process...');
      console.log('Email:', email);
      console.log('UserData:', userData);

      // 1️⃣ Criar usuário no Auth
      console.log('Creating user in Auth...');
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Auth user created:', result.user.uid);

      // 2️⃣ Atualizar displayName se fornecido
      if (userData.displayName) {
        console.log('Updating displayName...');
        await firebaseUpdateProfile(result.user, { displayName: userData.displayName });
        console.log('DisplayName updated');
      }

      // 3️⃣ Criar perfil no Firestore
      const profileData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: userData.displayName || '',
        role: userData.role || 'consultora',
        createdAt: new Date(),
        emailVerified: result.user.emailVerified
      };

      console.log('Creating profile in Firestore...');
      console.log('Profile data:', profileData);
      const firestoreResult = await firebaseFirestore.createUser(profileData);
      console.log('Firestore result:', firestoreResult);

      if (!firestoreResult.success) {
        console.error('Firestore creation failed:', firestoreResult.error);
        // Remove usuário do Auth se Firestore falhar
        await result.user.delete();
        throw new Error(`Erro ao criar perfil no Firestore: ${firestoreResult.error}`);
      }

      console.log('Signup successful');
      return { success: true, user: result.user, data: profileData };
    } catch (error) {
      console.error('Signup error:', error);
      // Handle specific Firebase Auth errors for signup
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Este email já está sendo usado. Tente fazer login.', code: error.code };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Email inválido.', code: error.code };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, error: 'A senha é muito fraca. Use pelo menos 6 caracteres.', code: error.code };
      } else if (error.code === 'auth/operation-not-allowed') {
        return { success: false, error: 'Cadastro de usuários não está habilitado.', code: error.code };
      } else {
        return { success: false, error: error.message, code: error.code };
      }
    }
  }

  // Logout
  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  // Update profile
  async updateProfile(updates) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("Nenhum usuário autenticado");

      const validUpdates = {};
      if (updates.displayName) validUpdates.displayName = updates.displayName;
      if (updates.photoURL) validUpdates.photoURL = updates.photoURL;

      if (Object.keys(validUpdates).length > 0) {
        await firebaseUpdateProfile(user, validUpdates);
      }

      // Atualiza também no Firestore
      const firestoreResult = await firebaseFirestore.updateUser(user.uid, validUpdates);
      if (!firestoreResult.success) throw new Error(firestoreResult.error);

      return { success: true, data: this.#mapUserData(user) };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  // Reset de senha
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      // Handle specific Firebase Auth errors for password reset
      if (error.code === 'auth/user-not-found') {
        return { success: false, error: 'Este email não está cadastrado.', code: error.code };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Email inválido.', code: error.code };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Muitas tentativas. Tente novamente mais tarde.', code: error.code };
      } else {
        return { success: false, error: error.message, code: error.code };
      }
    }
  }

  // Auth state change
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, (user) => {
      callback(user ? { success: true, data: this.#mapUserData(user) } : { success: false, user: null });
    });
  }

  #mapUserData(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }
}

export const firebaseAuth = new FirebaseAuth();
