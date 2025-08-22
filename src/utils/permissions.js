/**
 * Utilitários para gerenciar permissões de acesso
 */

/**
 * Verifica se o usuário tem acesso à área de grupos
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se tem acesso à área de grupos
 */
export const hasGroupAccess = (user) => {
  if (!user) return false;

  // Admin tem acesso a tudo
  if (user.type === "admin") return true;

  // Estudantes só têm acesso se possuem grupo
  return user.type === "student" && user.hasGroup === true;
};

/**
 * Verifica se o usuário tem acesso à área sem grupos
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se tem acesso à área sem grupos
 */
export const hasNoGroupAccess = (user) => {
  if (!user) return false;

  // Admin tem acesso a tudo
  if (user.type === "admin") return true;

  // Estudantes só têm acesso se NÃO possuem grupo
  return user.type === "student" && user.hasGroup === false;
};

/**
 * Verifica se o usuário é admin (acesso total)
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se é admin
 */
export const isAdmin = (user) => {
  return user?.type === "admin";
};

/**
 * Verifica se o usuário pode acessar ambas as áreas
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se pode acessar ambas as áreas
 */
export const hasFullAccess = (user) => {
  return isAdmin(user);
};

/**
 * Retorna o tipo de acesso do usuário
 * @param {Object} user - Objeto do usuário
 * @returns {string} - 'admin', 'withGroup', 'withoutGroup', ou 'none'
 */
export const getUserAccessType = (user) => {
  if (!user) return "none";

  if (user.type === "admin") return "admin";

  if (user.type === "student") {
    return user.hasGroup ? "withGroup" : "withoutGroup";
  }

  return "none";
};
