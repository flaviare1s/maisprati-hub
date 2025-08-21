import api from "../services/api.js";

// Funções para gerenciar quadros Kanban
export const fetchKanbanBoard = async (teamId) => {
  const response = await api.get(`/kanbanBoards?teamId=${teamId}`);
  return response.data[0]; // Retorna o primeiro quadro do time
};

export const fetchKanbanColumns = async (boardId) => {
  const response = await api.get(
    `/kanbanColumns?boardId=${boardId}&_sort=order`
  );
  return response.data;
};

export const fetchKanbanTasks = async (boardId) => {
  const response = await api.get(
    `/kanbanTasks?boardId=${boardId}&isActive=true`
  );
  return response.data;
};

export const fetchTaskComments = async (taskId) => {
  const response = await api.get(
    `/taskComments?taskId=${taskId}&_sort=createdAt&_order=desc`
  );
  return response.data;
};

// Funções para criar/atualizar (a serem implementadas posteriormente)
export const createTask = async (taskData) => {
  const response = await api.post("/kanbanTasks", taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/kanbanTasks/${taskId}`, taskData);
  return response.data;
};

export const moveTask = async (taskId, newColumnId) => {
  const response = await api.patch(`/kanbanTasks/${taskId}`, {
    columnId: newColumnId,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};

export const addTaskComment = async (commentData) => {
  const response = await api.post("/taskComments", commentData);
  return response.data;
};

// Função para buscar dados completos do Kanban de um time
export const getTeamKanbanData = async (teamId) => {
  try {
    const board = await fetchKanbanBoard(teamId);
    if (!board) {
      return null;
    }

    const [columns, tasks] = await Promise.all([
      fetchKanbanColumns(board.id),
      fetchKanbanTasks(board.id),
    ]);

    return {
      board,
      columns,
      tasks,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do Kanban:", error);
    throw error;
  }
};
