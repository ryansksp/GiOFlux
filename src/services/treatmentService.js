// Treatment Service - Handles treatment management operations
import { supabaseDatabase } from './supabase/database';

class TreatmentService {
  constructor() {
    this.database = supabaseDatabase;
  }

  async createTreatment(treatmentData) {
    return this.database.createTreatment(treatmentData);
  }

  async getTreatments(userId, options = {}) {
    return this.database.getTreatments(userId, options);
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.database.updateTreatment(treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.database.deleteTreatment(treatmentId);
  }
}

export const treatmentService = new TreatmentService();
