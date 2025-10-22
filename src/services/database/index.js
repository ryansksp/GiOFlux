// Database Abstraction Layer
// This provides a unified interface for switching between Firebase and other databases later

import { firebaseAuth } from '../firebase/auth';
import { firebaseFirestore } from '../firebase/firestore';

// Current implementation using Firebase
class DatabaseService {
  constructor() {
    this.auth = firebaseAuth;
    this.firestore = firebaseFirestore;
    this.storage = null; // Storage not implemented yet
  }

  // Authentication methods
  async signIn(email, password) {
    return this.auth.signIn(email, password);
  }

  async signUp(email, password, userData) {
    return this.auth.signUp(email, password, userData);
  }

  async signOut() {
    return this.auth.signOut();
  }

  async getCurrentUser() {
    const user = this.auth.auth.currentUser;
    if (!user) return null;

    // Get additional profile data from Firestore
    const profileResult = await this.firestore.getUser(user.uid);
    if (profileResult.success) {
      return {
        ...user,
        ...profileResult.data,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || profileResult.data.displayName,
        role: profileResult.data.role || 'consultora'
      };
    }

    // Fallback to basic auth data
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'consultora'
    };
  }

  async updateProfile(userData) {
    return this.auth.updateProfile(userData);
  }

  async resetPassword(email) {
    return this.auth.resetPassword(email);
  }

  // User management
  async createUser(userData) {
    return this.firestore.createUser(userData);
  }

  async getUser(userId) {
    return this.firestore.getUser(userId);
  }

  async updateUser(userId, userData) {
    return this.firestore.updateUser(userId, userData);
  }

  // Client management
  async createClient(clientData) {
    return this.firestore.createClient(clientData);
  }

  async getClients(userId, options = {}) {
    return this.firestore.getClients(userId, options);
  }

  async updateClient(clientId, clientData) {
    return this.firestore.updateClient(clientId, clientData);
  }

  async deleteClient(clientId) {
    return this.firestore.deleteClient(clientId);
  }

  // Appointment management
  async createAppointment(appointmentData) {
    return this.firestore.createAppointment(appointmentData);
  }

  async getAppointments(userId, options = {}) {
    return this.firestore.getAppointments(userId, options);
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.firestore.updateAppointment(appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.firestore.deleteAppointment(appointmentId);
  }

  // Treatment management
  async createTreatment(treatmentData) {
    return this.firestore.createTreatment(treatmentData);
  }

  async getTreatments(userId, options = {}) {
    return this.firestore.getTreatments(userId, options);
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.firestore.updateTreatment(treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.firestore.deleteTreatment(treatmentId);
  }

  // Financial transactions
  async createTransaction(transactionData) {
    return this.firestore.createTransaction(transactionData);
  }

  async getTransactions(userId, options = {}) {
    return this.firestore.getTransactions(userId, options);
  }

  async getAllTransactions(collectionName = 'transactions') {
    return this.firestore.getAllTransactions(collectionName);
  }

  async updateTransaction(transactionId, transactionData) {
    return this.firestore.updateTransaction(transactionId, transactionData);
  }

  async deleteTransaction(transactionId) {
    return this.firestore.deleteTransaction(transactionId);
  }

  // Campaign management
  async createCampaign(campaignData) {
    return this.firestore.createCampaign(campaignData);
  }

  async getCampaigns(userId, options = {}) {
    return this.firestore.getCampaigns(userId, options);
  }

  async updateCampaign(campaignId, campaignData) {
    return this.firestore.updateCampaign(campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.firestore.deleteCampaign(campaignId);
  }

  // File storage (optional - can be disabled if storage costs are an issue)
  async uploadFile(file, path) {
    // Not implemented yet
    return { success: false, error: 'Storage not implemented' };
  }

  async getDownloadURL(path) {
    // Not implemented yet
    return { success: false, error: 'Storage not implemented' };
  }

  async deleteFile(path) {
    // Not implemented yet
    return { success: false, error: 'Storage not implemented' };
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export for convenience
export default databaseService;
