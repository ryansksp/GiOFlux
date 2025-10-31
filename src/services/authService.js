// Auth Service - Handles authentication operations
import { supabaseAuth } from './supabase/auth';

class AuthService {
  constructor() {
    this.auth = supabaseAuth;
  }

  async signIn(email, password) {
    return this.auth.signIn(email, password);
  }

  async signUp(email, password, userData) {
    return this.auth.signUp(email, password, userData);
  }

  async signOut() {
    return this.auth.signOut();
  }

  async resetPassword(email) {
    return this.auth.resetPassword(email);
  }

  async updateProfile(updates) {
    return this.auth.updateProfile(updates);
  }

  onAuthStateChange(callback) {
    return this.auth.onAuthStateChange(callback);
  }

  // Additional methods for Supabase compatibility
  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  getCurrentSession() {
    return this.auth.getCurrentSession();
  }
}

export const authService = new AuthService();
