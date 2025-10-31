import { supabase } from './client';

export class SupabaseDatabase {
  constructor() {
    this.supabase = supabase;
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async read(table, id) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Record not found' };
        }
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async update(table, id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async delete(table, id) {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async list(table, options = {}) {
    try {
      let query = this.supabase.from(table).select('*', { count: 'exact' });

      // Filters
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          query = query.filter(field, operator, value);
        });
      }

      // Ordering
      if (options.orderBy) {
        if (Array.isArray(options.orderBy)) {
          const [field, direction] = options.orderBy;
          query = query.order(field, { ascending: direction === 'asc' });
        } else {
          query = query.order(options.orderBy, { ascending: false });
        }
      }

      // Limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Range for pagination
      if (options.range) {
        query = query.range(options.range[0], options.range[1]);
      }

      const { data, error, count } = await query;

      if (error) {
        return { success: false, error: error.message, code: error.code };
      }

      return {
        success: true,
        data,
        count
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== Users =====
  async createUser(userData) {
    return this.create('users', userData);
  }

  async getUser(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Record not found' };
        }
        console.error('Erro ao buscar usuário:', error);
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, userData) {
    return this.update('users', userId, userData);
  }

  async getAllUsers() {
    return this.list('users');
  }

  // ===== Clients =====
  async getClients(userId, options = {}) {
    const filters = options.where ? [...options.where] : [];
    filters.push(['user_id', 'eq', userId]);

    return this.list('clients', {
      ...options,
      where: filters
    });
  }

  async createClient(clientData) {
    return this.create('clients', clientData);
  }

  async updateClient(clientId, clientData) {
    return this.update('clients', clientId, clientData);
  }

  async deleteClient(clientId) {
    return this.delete('clients', clientId);
  }

  // ===== Appointments =====
  async getAppointments(userId, options = {}) {
    const filters = options.where ? [...options.where] : [];
    filters.push(['user_id', 'eq', userId]);

    return this.list('appointments', {
      ...options,
      where: filters
    });
  }

  async createAppointment(appointmentData) {
    // Map form data to database schema
    const mappedData = {
      user_id: appointmentData.userId || appointmentData.user_id,
      client_id: appointmentData.cliente_id || appointmentData.client_id,
      data_hora: appointmentData.data_hora,
      servico: appointmentData.tipo_tratamento || appointmentData.servico,
      duracao_minutos: appointmentData.duracao_minutos,
      status: appointmentData.status,
      observacoes: appointmentData.observacoes,
    };

    // Remove undefined values
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] === undefined) {
        delete mappedData[key];
      }
    });

    try {
      const { data: result, error } = await this.supabase
        .from('appointments')
        .insert([mappedData])
        .select('id, user_id, client_id, data_hora, servico, duracao_minutos, status, observacoes, created_at, updated_at')
        .single();

      if (error) {
        return { success: false, error: error.message, code: error.code };
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.update('appointments', appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.delete('appointments', appointmentId);
  }

  // ===== Treatments =====
  async getTreatments(userId, options = {}) {
    const filters = options.where ? [...options.where] : [];
    filters.push(['user_id', 'eq', userId]);

    return this.list('treatments', {
      ...options,
      where: filters
    });
  }

  async createTreatment(treatmentData) {
    return this.create('treatments', treatmentData);
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.update('treatments', treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.delete('treatments', treatmentId);
  }

  // ===== Financial Transactions =====
  async getTransactions(userId, options = {}) {
    const filters = options.where ? [...options.where] : [];
    filters.push(['user_id', 'eq', userId]);

    return this.list('transactions', {
      ...options,
      where: filters
    });
  }

  async createTransaction(transactionData) {
    return this.create('transactions', transactionData);
  }

  async updateTransaction(transactionId, transactionData) {
    return this.update('transactions', transactionId, transactionData);
  }

  async deleteTransaction(transactionId) {
    return this.delete('transactions', transactionId);
  }

  // ===== Campaigns =====
  async getCampaigns(userId, options = {}) {
    const filters = options.where ? [...options.where] : [];
    filters.push(['user_id', 'eq', userId]);

    return this.list('campaigns', {
      ...options,
      where: filters
    });
  }

  async createCampaign(campaignData) {
    return this.create('campaigns', campaignData);
  }

  async updateCampaign(campaignId, campaignData) {
    return this.update('campaigns', campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.delete('campaigns', campaignId);
  }
}

export const supabaseDatabase = new SupabaseDatabase();
