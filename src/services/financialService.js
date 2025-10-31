// Financial Service - Handles financial transaction operations
import { supabaseDatabase } from './supabase/database';

class FinancialService {
  constructor() {
    this.database = supabaseDatabase;
  }

  async createTransaction(transactionData) {
    return this.database.createTransaction(transactionData);
  }

  async getTransactions(userId, options = {}) {
    return this.database.getTransactions(userId, options);
  }

  async getAllTransactions(collectionName = 'transactions') {
    // For Supabase, we'll get all transactions without user filter for admin purposes
    return this.database.list(collectionName);
  }

  async updateTransaction(transactionId, transactionData) {
    return this.database.updateTransaction(transactionId, transactionData);
  }

  async deleteTransaction(transactionId) {
    return this.database.deleteTransaction(transactionId);
  }
}

export const financialService = new FinancialService();
