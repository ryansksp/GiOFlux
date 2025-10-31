export const clienteSchema = {
  'name': 'Cliente',
  'type': 'object',
  'properties': {
    'nome_completo': {
      'type': 'string',
      'description': 'Nome completo do cliente'
    },
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'telefone': {
      'type': 'string'
    },
    'data_nascimento': {
      'type': 'string',
      'format': 'date'
    },
    'cpf': {
      'type': 'string'
    },
    'endereco': {
      'type': 'string'
    },
    'cidade': {
      'type': 'string'
    },
    'estado': {
      'type': 'string'
    },
    'cep': {
      'type': 'string'
    },
    'tipo_pele': {
      'type': 'string',
      'enum': [
        'Tipo I',
        'Tipo II',
        'Tipo III',
        'Tipo IV',
        'Tipo V',
        'Tipo VI'
      ]
    },
    'observacoes': {
      'type': 'string'
    },
    'status': {
      'type': 'string',
      'enum': [
        'ativo',
        'inativo',
        'lead'
      ],
      'default': 'lead'
    },
    'origem': {
      'type': 'string',
      'enum': [
        'indicacao',
        'redes_sociais',
        'google',
        'site',
        'outros'
      ]
    },
    'foto_perfil': {
      'type': 'string'
    }
  },
  'required': [
    'nome_completo',
    'telefone'
  ]
};
