# +PraTi Hub

## Visão Geral do Projeto

### Pré-requisitos

- Node.js 18+
- Java 17+ (para o backend Spring Boot)
- MongoDB

### Configuração do Projeto

#### 1. Clonar o repositório

```bash
git clone https://github.com/flaviare1s/maisprati-hub.git
cd maisprati-hub
```

#### 2. Configurar o Frontend

```bash
# Instalar dependências do frontend
npm install
```

#### 3. Configurar o Backend

- Clonar o repositório do backend: https://github.com/flaviare1s/maisprati-hub-server
- O backend é uma aplicação Spring Boot
- Certifique-se de que o MongoDB está rodando
- Configure as variáveis de ambiente necessárias no backend
- Execute o projeto pelo IntelliJ IDEA ou a IDE de sua preferência (porta 8080)

#### 4. Executar o Frontend

```bash
# Na pasta raiz do projeto frontend
npm run dev
```

#### 5. Deploy

**Aplicação em produção:** https://maisprati-hub.vercel.app/

#### 6. Acessar a aplicação

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

### 7. Estrutura de pastas

```
src/
├── assets/          → imagens, ícones e outros arquivos
├── components/      → componentes reutilizáveis (botões, menus, etc)
├── pages/          → páginas do aplicativo, possuem rota (Home, Login, About, etc)
├── contexts/       → contextos de estado global do React
├── hooks/          → hooks customizados
├── services/       → configurações de API e serviços
├── api.js/         → funções de API organizadas por funcionalidade
├── App.jsx         → onde ficam as rotas que conectam as páginas
├── main.jsx        → ponto de entrada do React
└── index.css       → variáveis de cores, fontes e configurações dos temas
```

### 8. Funcionalidades Principais

- **Autenticação**: Login e registro de usuários
- **Dashboard**: Painéis diferentes para students e admins
- **Teams**: Sistema de equipes/guildas
- **Calendário**: Agendamento de reuniões
- **Fórum**: Sistema de posts e comentários
- **Notificações**: Sistema de notificações em tempo real
- **Perfil**: Gerenciamento de perfil de usuário

### 9. Tecnologias Utilizadas

**Frontend:**

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Day.js

**Backend:**

- Spring Boot
- MongoDB
- JWT Authentication
- Spring Security
