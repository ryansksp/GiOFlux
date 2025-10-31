// Client Service - Handles client management operations
import { supabaseDatabase } from './supabase/database';

class ClientService {
  constructor() {
    this.database = supabaseDatabase;
  }

// Valid fields for the clients table in Supabase
static VALID_CLIENT_FIELDS = [
  'nome_completo',
  'email',
  'telefone',
  'data_nascimento',
  'cpf',
  'endereco',
  'cidade',
  'estado',
  'cep',
  'tipo_pele',
  'observacoes',
  'status',
  'user_id'  // mantido, pois é obrigatório para vincular o usuário
];


  // Clean client data to only include valid fields
  cleanClientData(clientData) {
    const cleanedData = {};
    for (const [key, value] of Object.entries(clientData)) {
      if (ClientService.VALID_CLIENT_FIELDS.includes(key)) {
        // Convert empty strings to null for date fields
        if (key === 'data_nascimento' && value === '') {
          cleanedData[key] = null;
        } else {
          cleanedData[key] = value;
        }
      }
    }
    console.log('Cleaned client data:', cleanedData);
    return cleanedData;
  }

  async createClient(clientData) {
    const cleanedData = this.cleanClientData(clientData);
    return this.database.createClient(cleanedData);
  }

  async getClients(userId, options = {}) {
    return this.database.getClients(userId, options);
  }

  async updateClient(clientId, clientData) {
    const cleanedData = this.cleanClientData(clientData);
    return this.database.updateClient(clientId, cleanedData);
  }

  async deleteClient(clientId) {
    return this.database.deleteClient(clientId);
  }
}

export const clientService = new ClientService();
