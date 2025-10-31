import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase client to avoid import issues
vi.mock('./supabase/client', () => ({
  supabase: {},
}));

// Mock the entire database module
vi.mock('./supabase/database.js', () => ({
  supabaseDatabase: {
    createClient: vi.fn(),
    updateClient: vi.fn(),
    getClients: vi.fn(),
    deleteClient: vi.fn(),
  },
}));

// Import after mocking
import { clientService } from './clientService';

// Test the cleanClientData function directly without importing the service
describe('ClientService', () => {
  describe('cleanClientData', () => {
    it('should filter out invalid fields and keep only valid ones', () => {
      const inputData = {
        nome_completo: 'João Silva',
        email: 'joao@example.com',
        telefone: '123456789',
        data_nascimento: '1990-01-01',
        cpf: '12345678901',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        tipo_pele: 'Normal',
        observacoes: 'Cliente regular',
        status: 'ativo',
        origem: 'site',
        user_id: 'user123',
        // Invalid fields
        invalid_field: 'should be removed',
        another_invalid: 123,
        extra_data: { nested: 'object' },
      };

      const result = clientService.cleanClientData(inputData);

      expect(result).toEqual({
        nome_completo: 'João Silva',
        email: 'joao@example.com',
        telefone: '123456789',
        data_nascimento: '1990-01-01',
        cpf: '12345678901',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        tipo_pele: 'Normal',
        observacoes: 'Cliente regular',
        status: 'ativo',
        user_id: 'user123',
      });

      // Check that invalid fields are not present
      expect(result.invalid_field).toBeUndefined();
      expect(result.another_invalid).toBeUndefined();
      expect(result.extra_data).toBeUndefined();
    });

    it('should return empty object for data with no valid fields', () => {
      const inputData = {
        invalid1: 'value1',
        invalid2: 'value2',
      };

      const result = clientService.cleanClientData(inputData);

      expect(result).toEqual({});
    });

    it('should handle empty input data', () => {
      const result = clientService.cleanClientData({});

      expect(result).toEqual({});
    });
  });
});

describe('ClientService', () => {
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = vi.mocked(require('./supabase/database').supabaseDatabase);
    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('cleanClientData', () => {
    it('should filter out invalid fields and keep only valid ones', () => {
      const inputData = {
        nome_completo: 'João Silva',
        email: 'joao@example.com',
        telefone: '123456789',
        data_nascimento: '1990-01-01',
        cpf: '12345678901',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        tipo_pele: 'Normal',
        observacoes: 'Cliente regular',
        status: 'ativo',
        origem: 'site',
        user_id: 'user123',
        // Invalid fields
        invalid_field: 'should be removed',
        another_invalid: 123,
        extra_data: { nested: 'object' },
      };

      const result = clientService.cleanClientData(inputData);

      expect(result).toEqual({
        nome_completo: 'João Silva',
        email: 'joao@example.com',
        telefone: '123456789',
        data_nascimento: '1990-01-01',
        cpf: '12345678901',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        tipo_pele: 'Normal',
        observacoes: 'Cliente regular',
        status: 'ativo',
        user_id: 'user123',
      });

      // Check that invalid fields are not present
      expect(result.invalid_field).toBeUndefined();
      expect(result.another_invalid).toBeUndefined();
      expect(result.extra_data).toBeUndefined();
    });

    it('should return empty object for data with no valid fields', () => {
      const inputData = {
        invalid1: 'value1',
        invalid2: 'value2',
      };

      const result = clientService.cleanClientData(inputData);

      expect(result).toEqual({});
    });

    it('should handle empty input data', () => {
      const result = clientService.cleanClientData({});

      expect(result).toEqual({});
    });
  });

  describe('createClient', () => {
    it('should clean data and call database.createClient with cleaned data', async () => {
      const inputData = {
        nome_completo: 'João Silva',
        email: 'joao@example.com',
        invalid_field: 'should be removed',
      };

      const expectedCleanedData = {
        nome_completo: 'João Silva',
        email: 'joao@example.com',
      };

      mockDatabase.createClient.mockResolvedValue({ success: true, data: { id: 1, ...expectedCleanedData } });

      const result = await clientService.createClient(inputData);

      expect(mockDatabase.createClient).toHaveBeenCalledWith(expectedCleanedData);
      expect(result).toEqual({ success: true, data: { id: 1, ...expectedCleanedData } });
    });
  });

  describe('updateClient', () => {
    it('should clean data and call database.updateClient with cleaned data', async () => {
      const clientId = 'client123';
      const inputData = {
        nome_completo: 'João Silva Updated',
        email: 'joao.updated@example.com',
        invalid_field: 'should be removed',
      };

      const expectedCleanedData = {
        nome_completo: 'João Silva Updated',
        email: 'joao.updated@example.com',
      };

      mockDatabase.updateClient.mockResolvedValue({ success: true, data: { id: clientId, ...expectedCleanedData } });

      const result = await clientService.updateClient(clientId, inputData);

      expect(mockDatabase.updateClient).toHaveBeenCalledWith(clientId, expectedCleanedData);
      expect(result).toEqual({ success: true, data: { id: clientId, ...expectedCleanedData } });
    });
  });

  describe('getClients', () => {
    it('should call database.getClients with correct parameters', async () => {
      const userId = 'user123';
      const options = { limit: 10 };
      const expectedResult = { success: true, data: [] };

      mockDatabase.getClients.mockResolvedValue(expectedResult);

      const result = await clientService.getClients(userId, options);

      expect(mockDatabase.getClients).toHaveBeenCalledWith(userId, options);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteClient', () => {
    it('should call database.deleteClient with correct clientId', async () => {
      const clientId = 'client123';
      const expectedResult = { success: true };

      mockDatabase.deleteClient.mockResolvedValue(expectedResult);

      const result = await clientService.deleteClient(clientId);

      expect(mockDatabase.deleteClient).toHaveBeenCalledWith(clientId);
      expect(result).toEqual(expectedResult);
    });
  });
});
