// Appointment Service - Handles appointment management operations
import { supabaseDatabase } from './supabase/database';

class AppointmentService {
  constructor() {
    this.database = supabaseDatabase;
  }

  async createAppointment(appointmentData) {
    return this.database.createAppointment(appointmentData);
  }

  async getAppointments(userId, options = {}) {
    return this.database.getAppointments(userId, options);
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.database.updateAppointment(appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.database.deleteAppointment(appointmentId);
  }
}

export const appointmentService = new AppointmentService();
