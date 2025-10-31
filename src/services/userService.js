// User Service - Handles user management operations
import { supabaseDatabase } from './supabase/database';

class UserService {
  constructor() {
    this.database = supabaseDatabase;
  }

  async createUser(userData) {
    return this.database.createUser(userData);
  }

  async getUser(userId) {
    return this.database.getUser(userId);
  }

  async updateUser(userId, userData) {
    return this.database.updateUser(userId, userData);
  }

  async getAllUsers() {
    return this.database.getAllUsers();
  }
}

export const userService = new UserService();
