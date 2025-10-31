// Database Abstraction Layer
// This provides a unified interface for switching between Firebase and other databases later

import { authService } from '../authService';
import { clientService } from '../clientService';
import { appointmentService } from '../appointmentService';
import { treatmentService } from '../treatmentService';
import { financialService } from '../financialService';
import { userService } from '../userService';
import { campaignService } from '../campaignService';

// Current implementation using Firebase services
class DatabaseService {
  constructor() {
    this.auth = authService;
    this.clients = clientService;
    this.appointments = appointmentService;
    this.treatments = treatmentService;
    this.financial = financialService;
    this.users = userService;
    this.campaigns = campaignService;
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
    try {
      const authResult = await this.auth.getCurrentUser();
      if (!authResult.success || !authResult.data?.user) return null;

      const user = authResult.data.user;

      // Get additional profile data from Supabase
      const profileResult = await this.users.getUser(user.id);
      if (profileResult.success) {
        return {
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name || profileResult.data.displayName,
          ...profileResult.data
        };
      }

      // Fallback to basic auth data
      return {
        uid: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name,
        role: 'consultora'
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  async updateProfile(userData) {
    return this.auth.updateProfile(userData);
  }

  async resetPassword(email) {
    return this.auth.resetPassword(email);
  }

  // User management
  async createUser(userData) {
    return this.users.createUser(userData);
  }

  async getUser(userId) {
    return this.users.getUser(userId);
  }

  async updateUser(userId, userData) {
    return this.users.updateUser(userId, userData);
  }

  // Client management
  async createClient(clientData) {
    return this.clients.createClient(clientData);
  }

  async getClients(userId, options = {}) {
    return this.clients.getClients(userId, options);
  }

  async updateClient(clientId, clientData) {
    return this.clients.updateClient(clientId, clientData);
  }

  async deleteClient(clientId) {
    return this.clients.deleteClient(clientId);
  }

  // Appointment management
  async createAppointment(appointmentData) {
    return this.appointments.createAppointment(appointmentData);
  }

  async getAppointments(userId, options = {}) {
    return this.appointments.getAppointments(userId, options);
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.appointments.updateAppointment(appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.appointments.deleteAppointment(appointmentId);
  }

  // Treatment management
  async createTreatment(treatmentData) {
    return this.treatments.createTreatment(treatmentData);
  }

  async getTreatments(userId, options = {}) {
    return this.treatments.getTreatments(userId, options);
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.treatments.updateTreatment(treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.treatments.deleteTreatment(treatmentId);
  }

  // Financial transactions
  async createTransaction(transactionData) {
    return this.financial.createTransaction(transactionData);
  }

  async getTransactions(userId, options = {}) {
    return this.financial.getTransactions(userId, options);
  }

  async getAllTransactions(collectionName = 'transactions') {
    return this.financial.getAllTransactions(collectionName);
  }

  async updateTransaction(transactionId, transactionData) {
    return this.financial.updateTransaction(transactionId, transactionData);
  }

  async deleteTransaction(transactionId) {
    return this.financial.deleteTransaction(transactionId);
  }

  // Campaign management
  async createCampaign(campaignData) {
    return this.campaigns.createCampaign(campaignData);
  }

  async getCampaigns(userId, options = {}) {
    return this.campaigns.getCampaigns(userId, options);
  }

  async updateCampaign(campaignId, campaignData) {
    return this.campaigns.updateCampaign(campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.campaigns.deleteCampaign(campaignId);
  }

  // User management for admins
  async getAllUsers() {
    try {
      const result = await this.users.getAllUsers();
      return result;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      return { success: false, error: error.message };
    }
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
