// Dados mockados para testes
export const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@teste.com",
    type: "student",
    codename: "JOAO123",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@teste.com",
    type: "student",
    codename: "MARIA456",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@teste.com",
    type: "admin",
    codename: "ADMIN123",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

export const mockTeams = [
  {
    id: "1",
    name: "Team Alpha",
    members: ["1", "2"],
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const mockNotifications = [
  {
    id: "1",
    userId: "1",
    message: "Bem-vindo ao sistema!",
    read: false,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    message: "Sua equipe foi criada.",
    read: true,
    createdAt: "2024-01-02T00:00:00Z",
  },
];
