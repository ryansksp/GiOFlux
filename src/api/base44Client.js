// Mock do base44 API client
export const base44 = {
  auth: {
    me: async () => ({
      id: 1,
      full_name: 'Usuário Teste',
      email: 'teste@gioflux.com',
      role: 'gerente'
    }),
    logout: async () => {
      console.log('Logout realizado')
    }
  },
  entities: {
    Cliente: {
      list: async (order) => [
        {
          id: 1,
          nome: 'Maria Silva',
          email: 'maria@email.com',
          telefone: '(11) 99999-9999',
          status: 'ativo',
          created_date: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          nome: 'João Santos',
          email: 'joao@email.com',
          telefone: '(11) 88888-8888',
          status: 'ativo',
          created_date: '2024-01-20T14:30:00Z'
        },
        {
          id: 3,
          nome: 'Ana Costa',
          email: 'ana@email.com',
          telefone: '(11) 77777-7777',
          status: 'inativo',
          created_date: '2024-01-10T09:15:00Z'
        }
      ]
    },
    Agendamento: {
      list: async (order) => [
        {
          id: 1,
          cliente_id: 1,
          data_hora: '2024-01-25T10:00:00Z',
          servico: 'Limpeza de Pele',
          status: 'confirmado'
        },
        {
          id: 2,
          cliente_id: 2,
          data_hora: '2024-01-25T14:00:00Z',
          servico: 'Massagem',
          status: 'confirmado'
        },
        {
          id: 3,
          cliente_id: 1,
          data_hora: '2024-01-26T11:00:00Z',
          servico: 'Tratamento Facial',
          status: 'pendente'
        }
      ]
    },
    Transacao: {
      list: async (order) => [
        {
          id: 1,
          tipo: 'receita',
          valor: 150.00,
          data_transacao: '2024-01-15T10:00:00Z',
          status: 'confirmado',
          descricao: 'Pagamento - Limpeza de Pele'
        },
        {
          id: 2,
          tipo: 'receita',
          valor: 200.00,
          data_transacao: '2024-01-20T14:00:00Z',
          status: 'confirmado',
          descricao: 'Pagamento - Massagem'
        },
        {
          id: 3,
          tipo: 'despesa',
          valor: 50.00,
          data_transacao: '2024-01-18T09:00:00Z',
          status: 'confirmado',
          descricao: 'Compra de produtos'
        }
      ]
    },
    Tratamento: {
      list: async (order) => [
        {
          id: 1,
          cliente_id: 1,
          tipo_tratamento: 'Limpeza de Pele',
          data_tratamento: '2024-01-15T10:00:00Z',
          valor: 150.00,
          status: 'concluido'
        },
        {
          id: 2,
          cliente_id: 2,
          tipo_tratamento: 'Massagem',
          data_tratamento: '2024-01-20T14:00:00Z',
          valor: 200.00,
          status: 'concluido'
        }
      ]
    },
    Campanha: {
      list: async (order) => [
        {
          id: 1,
          nome: 'Campanha Janeiro',
          descricao: 'Descontos especiais para novos clientes',
          data_inicio: '2024-01-01T00:00:00Z',
          data_fim: '2024-01-31T23:59:59Z',
          status: 'ativa'
        }
      ]
    }
  }
}
