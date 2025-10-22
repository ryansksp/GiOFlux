# Correções no Dashboard e Financeiro

## Problemas Identificados
- Gráfico "Receita dos Últimos 15 Dias" mostra os primeiros 15 dias do mês atual, não os últimos 15 dias
- Receita do mês pode não estar considerando fuso horário correto (Brasília)
- Dashboard não atualiza com transações existentes devido a datas futuras ou bugs na lógica

## Tarefas
- [ ] Corrigir lógica do gráfico RevenueChart.jsx para mostrar últimos 15 dias reais
- [ ] Ajustar cálculo de receita do mês para usar fuso horário de Brasília
- [ ] Verificar se transações estão sendo carregadas corretamente no dashboard
- [ ] Adicionar filtro de período no dashboard para visualizar meses anteriores
- [ ] Testar com dados existentes

## Status
- Análise completa dos arquivos relevantes
- Identificados bugs no gráfico e possíveis problemas de fuso horário
