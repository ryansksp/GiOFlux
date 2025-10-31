{

  "name": "Agendamento",

  "type": "object",

  "properties": {

    "cliente_id": {

      "type": "string"

    },

    "cliente_nome": {

      "type": "string"

    },

    "data_hora": {

      "type": "string",

      "format": "date-time"

    },

    "tipo_tratamento": {

      "type": "string"

    },

    "profissional": {

      "type": "string"

    },

    "sala": {

      "type": "string"

    },

    "duracao_minutos": {

      "type": "number",

      "default": 60

    },

    "status": {

      "type": "string",

      "enum": [

        "agendado",

        "confirmado",

        "realizado",

        "cancelado",

        "faltou"

      ],

      "default": "agendado"

    },

    "lembrete_enviado": {

      "type": "boolean",

      "default": false

    },

    "observacoes": {

      "type": "string"

    }

  },

  "required": [

    "cliente_id",

    "cliente_nome",

    "data_hora",

    "tipo_tratamento"

  ]

}