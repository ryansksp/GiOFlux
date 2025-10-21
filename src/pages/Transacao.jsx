{
  "name": "Transacao",
  "type": "object",
  "properties": {
    "cliente_id": {
      "type": "string"
    },
    "tratamento_id": {
      "type": "string"
    },
    "tipo": {
      "type": "string",
      "enum": [
        "receita",
        "despesa"
      ],
      "default": "receita"
    },
    "descricao": {
      "type": "string"
    },
    "valor": {
      "type": "number"
    },
    "metodo_pagamento": {
      "type": "string",
      "enum": [
        "dinheiro",
        "cartao_credito",
        "cartao_debito",
        "pix",
        "transferencia"
      ]
    },
    "data_transacao": {
      "type": "string",
      "format": "date"
    },
    "status": {
      "type": "string",
      "enum": [
        "pendente",
        "confirmado",
        "cancelado"
      ],
      "default": "confirmado"
    },
    "categoria": {
      "type": "string",
      "enum": [
        "tratamento",
        "produto",
        "consulta",
        "pacote",
        "outros"
      ]
    }
  },
  "required": [
    "descricao",
    "valor",
    "tipo",
    "data_transacao"
  ]
}