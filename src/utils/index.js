// Função para criar URLs de páginas
export const createPageUrl = (pageName) => {
  // Mapeamento especial para páginas que mudaram de nome
  const pageMapping = {
    'Tratamentos': 'procedimentos',
    'Tratamento': 'procedimento'
  };

  const mappedName = pageMapping[pageName] || pageName.toLowerCase();
  return `/${mappedName}`;
};
