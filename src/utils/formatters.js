// Formata valor para padrão brasileiro de moeda
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Formata data no padrão brasileiro
export const formatDate = (date, includeTime = false) => {
  if (!date) return '-';
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
};

// Verifica permissões do usuário
export const hasPermission = (user, requiredRole) => {
  if (!user || !user.tipo_usuario) return false;
  
  const roleHierarchy = {
    'admin': 3,
    'gerente': 2,
    'consultora': 1
  };
  
  return roleHierarchy[user.tipo_usuario] >= roleHierarchy[requiredRole];
};

// Verifica se usuário tem acesso a funcionalidade financeira
export const canAccessFinancial = (user) => {
  return hasPermission(user, 'gerente');
};