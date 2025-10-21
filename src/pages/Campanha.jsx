{
  "name": "Campanha",
  "type": "object",
  "properties": {
    "nome": {
      "type": "string"
    },
    "tipo": {
      "type": "string",
      "enum": [
        "email",
        "sms",
        "whatsapp",
        "notificacao"
      ]
    },
    "segmento": {
      "type": "string",
      "enum": [
        "todos",
        "novos_clientes",
        "clientes_ativos",
        "clientes_inativos",
        "aniversariantes"
      ]
    },
    "mensagem": {
      "type": "string"
    },
    "data_envio": {
      "type": "string",
      "format": "date"
    },
    "status": {
      "type": "string",
      "enum": [
        "rascunho",
        "agendada",
        "enviada",
        "cancelada"
      ],
      "default": "rascunho"
    },
    "total_destinatarios": {
      "type": "number"
    },
    "total_enviados": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "nome",
    "tipo",
    "mensagem"
  ]
}