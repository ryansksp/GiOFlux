# TODO - Preparação para Vercel e Segurança

## Segurança Crítica
- [x] Corrigir acesso direto sem login (falha crítica)
- [x] Remover possibilidade de registro como admin
- [x] Implementar sistema de aprovação de usuários por admin
- [x] Adicionar conformidade LGPD (política de privacidade, consentimento)

## Autenticação e Autorização
- [x] Proteger todas as rotas com verificação de login
- [x] Adicionar verificação de status de aprovação
- [x] Atualizar regras do Firestore para maior segurança
- [x] Adicionar validações extras no registro

## LGPD Compliance
- [x] Criar página de Política de Privacidade
- [x] Adicionar consentimento no formulário de registro
- [x] Implementar termos de uso

## Preparação para Vercel
- [x] Configurar build para produção
- [x] Criar vercel.json com configurações necessárias
- [x] Verificar compatibilidade de dependências

## Novos Componentes/Páginas
- [x] src/pages/PrivacyPolicy.jsx
- [x] src/pages/UserManagement.jsx (para admins gerenciarem aprovações)
- [x] vercel.json

## Testes e Validação
- [x] Testar fluxo de registro e aprovação
- [x] Verificar proteção de rotas
- [x] Testar build para Vercel
- [x] Validar segurança geral
