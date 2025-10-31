# Templates de Email do Supabase - SyncFlux

Este diretório contém os templates de email personalizados para o Supabase Auth do SyncFlux.

## Como configurar no Supabase

### 1. Acesse o painel do Supabase
1. Vá para seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Navegue para **Authentication > Email Templates**

### 2. Configure o template de confirmação
1. Selecione **Confirm signup** no menu lateral
2. Clique em **Enable custom email template**
3. Cole o conteúdo do arquivo `confirm_signup.html` no campo **Message**
4. Configure o **Subject** como: `Confirme sua conta - SyncFlux`
5. Clique em **Save**

### 3. Personalização adicional
Você pode personalizar ainda mais os templates editando as variáveis disponíveis:
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .Email }}` - Email do usuário
- `{{ .SiteURL }}` - URL do site

## Templates disponíveis

### ✅ Confirm signup (`confirm_signup.html`)
Template personalizado para confirmação de cadastro com:
- Design moderno e responsivo
- Branding do SyncFlux
- Gradientes e elementos visuais atrativos
- Lista de benefícios após confirmação
- Links para suporte e política de privacidade

### 🔐 Reset password (`reset_password.html`)
Template profissional para redefinição de senha com:
- Design focado em segurança e confiança
- Avisos claros sobre validade do link (1 hora)
- Dicas de segurança para criação de senha forte
- Elementos visuais que transmitem proteção
- Orientação clara sobre próximos passos

### 👥 Invite user (`invite_user.html`)
Template atrativo para convites de novos usuários com:
- Design welcoming e profissional
- Informações sobre quem convidou
- Lista de benefícios e funcionalidades
- Call-to-action claro para aceitar convite
- Elementos que incentivam a adesão

### 📧 Email change (`email_change.html`)
Template para confirmação de mudança de email com:
- Visual claro mostrando email atual e novo
- Avisos de segurança sobre a mudança
- Explicação do que acontece após confirmação
- Design que reforça a importância da ação

## Design System

### Cores
- **Primary**: `#823a80` (Roxo escuro)
- **Secondary**: `#c43c8b` (Rosa médio)
- **Accent**: `#e91e63` (Rosa vibrante)
- **Background**: `#f8f9fa` (Cinza claro)
- **Text**: `#333` (Cinza escuro)

### Tipografia
- **Fonte**: System font stack (compatível com todos os dispositivos)
- **Títulos**: Font-weight 700
- **Corpo**: Font-weight 400-600

### Elementos visuais
- Gradientes suaves
- Bordas arredondadas (16px para containers, 50px para botões)
- Sombras suaves para profundidade
- Ícones SVG inline

## Responsividade
Todos os templates são totalmente responsivos e funcionam bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## Configuração dos Templates

### Confirm signup
- **Arquivo**: `confirm_signup.html`
- **Subject**: `Confirme sua conta - SyncFlux`
- **Template no Supabase**: Confirm signup

### Reset password
- **Arquivo**: `reset_password.html`
- **Subject**: `Redefina sua senha - SyncFlux`
- **Template no Supabase**: Recovery

### Invite user
- **Arquivo**: `invite_user.html`
- **Subject**: `Convite para o SyncFlux`
- **Template no Supabase**: Invite (se disponível)

### Email change
- **Arquivo**: `email_change.html`
- **Subject**: `Confirme a mudança de email - SyncFlux`
- **Template no Supabase**: Email change (se disponível)

## Suporte
Para dúvidas sobre configuração ou personalização, consulte a [documentação do Supabase](https://supabase.com/docs/guides/auth/auth-email-templates).
