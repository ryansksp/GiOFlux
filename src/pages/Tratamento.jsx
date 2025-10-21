{
  "name": "Tratamento",
  "type": "object",
  "properties": {
    "cliente_id": {
      "type": "string",
      "description": "ID do cliente"
    },
    "tipo_tratamento": {
      "type": "string",
      "enum": [
        "Depilação a Laser - Face",
        "Depilação a Laser - Corpo",
        "Rejuvenescimento Facial",
        "Tratamento de Manchas",
        "Peeling",
        "Bioestimulador de Colágeno",
        "Harmonização Facial",
        "Outros"
      ]
    },
    "area_tratada": {
      "type": "string"
    },
    "data_tratamento": {
      "type": "string",
      "format": "date-time"
    },
    "profissional": {
      "type": "string"
    },
    "equipamento": {
      "type": "string"
    },
    "valor": {
      "type": "number"
    },
    "status_pagamento": {
      "type": "string",
      "enum": [
        "pendente",
        "pago",
        "parcial"
      ],
      "default": "pendente"
    },
    "sessao_numero": {
      "type": "number"
    },
    "total_sessoes": {
      "type": "number"
    },
    "observacoes": {
      "type": "string"
    },
    "foto_antes": {
      "type": "string"
    },
    "foto_depois": {
      "type": "string"
    }
  },
  "required": [
    "cliente_id",
    "tipo_tratamento",
    "data_tratamento"
  ]
}