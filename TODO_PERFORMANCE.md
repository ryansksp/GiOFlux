# TODO - Otimizações de Performance (Sprint Atual)

## ✅ CONCLUÍDO

## 🔧 EM ANDAMENTO

### Performance Crítica (ALTO)
- [x] **Queries Dashboard**: Otimizar múltiplas queries no Dashboard
- [x] **AuthContext Re-renders**: Otimizar AuthContext para reduzir re-renders
- [x] **parseAnyDate**: Memoizar função parseAnyDate
- [x] **Console.logs**: Remover todos os console.logs de produção

## 📋 PRÓXIMOS PASSOS

### Fase 1: Performance Crítica (ALTO)
- [x] **1.1** Otimizar Dashboard queries com Promise.all
- [x] **1.2** Memoizar AuthContext com useMemo/useCallback
- [x] **1.3** Memoizar função parseAnyDate
- [x] **1.4** Remover todos os console.logs de produção

### Fase 2: Arquitetura (MÉDIO)
- [x] **2.1** Quebrar DatabaseService em services menores
- [ ] **2.2** Padronizar loading states
- [ ] **2.3** Implementar paginação básica

## Informações Técnicas Coletadas
- **Dashboard.jsx**: 4 useQuery separadas que podem ser paralelizadas
- **AuthContext.jsx**: Provider value recriado a cada render, causando re-renders
- **parseAnyDate**: Função utilitária pura, ideal para memoização
- **Console.logs**: Encontrados em firestore.js, auth.js, Tratamento.jsx, etc.
- **DatabaseService**: Métodos agrupados por domínio (auth, clients, appointments, etc.)

## Plano de Implementação Detalhado

### Fase 1: Performance Crítica (ALTO)

#### 1.1 Otimizar Dashboard queries com Promise.all
**Arquivo**: `src/pages/Dashboard.jsx`
**Problema**: 4 queries separadas executadas sequencialmente
**Solução**: Usar Promise.all para paralelizar as queries
**Impacto**: Redução significativa no tempo de carregamento do Dashboard

#### 1.2 Memoizar AuthContext com useMemo/useCallback
**Arquivo**: `src/contexts/AuthContext.jsx`
**Problema**: Provider value recriado a cada render
**Solução**: Memoizar value com useMemo e funções com useCallback
**Impacto**: Redução de re-renders desnecessários em toda a aplicação

#### 1.3 Memoizar função parseAnyDate
**Arquivo**: `src/pages/Dashboard.jsx`
**Problema**: Função chamada múltiplas vezes sem memoização
**Solução**: Usar useCallback para memoizar a função
**Impacto**: Evita recriação da função em cada render

#### 1.4 Remover todos os console.logs de produção
**Arquivos**: `src/services/firebase/firestore.js`, `src/services/firebase/auth.js`, `src/pages/Tratamento.jsx`
**Problema**: Console.logs em produção afetam performance
**Solução**: Remover todos os console.log, console.warn, console.error
**Impacto**: Melhoria na performance de produção

## Próximos Passos
Implementar sistematicamente começando pelas otimizações de performance mais críticas.
