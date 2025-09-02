import api from "../services/api.js";

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  try {
    // Primeiro busca o usuário atual para preservar campos não editados
    const currentUserResponse = await api.get(`/users/${userId}`);
    const currentUser = currentUserResponse.data;

    // Lista de campos que nunca devem ser perdidos durante a edição
    const preservedFields = [
      "id",
      "password",
      "type",
      "avatar",
      "hasGroup",
      "wantsGroup",
      "isFirstLogin",
      "teamId",
    ];

    // Campos específicos por tipo de usuário
    const adminFields = [
      "id",
      "name",
      "email",
      "password",
      "type",
      "codename",
      "avatar",
    ];
    const studentFields = [
      "id",
      "name",
      "email",
      "password",
      "whatsapp",
      "type",
      "groupClass",
      "hasGroup",
      "wantsGroup",
      "isFirstLogin",
      "codename",
      "avatar",
      "teamId",
    ];

    // Determina quais campos são válidos para este tipo de usuário
    const validFields =
      currentUser.type === "admin" ? adminFields : studentFields;

    // Mescla apenas os dados válidos
    const mergedData = { ...currentUser };

    // Adiciona apenas campos válidos dos dados de atualização
    Object.keys(userData).forEach((key) => {
      if (validFields.includes(key)) {
        // Para o avatar, só atualiza se o valor não estiver vazio
        if (
          key === "avatar" &&
          (!userData[key] || userData[key].trim() === "")
        ) {
          // Mantém o avatar atual se o novo valor estiver vazio
          return;
        }
        mergedData[key] = userData[key];
      }
    });

    // Garante que campos preservados não sejam removidos se estavam presentes
    preservedFields.forEach((field) => {
      if (currentUser[field] !== undefined) {
        mergedData[field] = currentUser[field];
      }
    });

    // Remove campos que não deveriam existir para admin
    if (currentUser.type === "admin") {
      delete mergedData.whatsapp;
      delete mergedData.groupClass;
      delete mergedData.hasGroup;
      delete mergedData.wantsGroup;
      delete mergedData.isFirstLogin;
      delete mergedData.teamId;
    }

    console.log("Dados sendo enviados para atualização:", mergedData);

    const response = await api.put(`/users/${userId}`, mergedData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
