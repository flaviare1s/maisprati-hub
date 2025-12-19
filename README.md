# +praTiHub - Frontend

[![Português](https://img.shields.io/badge/lang-pt--BR-green)](README.md)
[![English](https://img.shields.io/badge/lang-en-blue)](README.en.md)

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

Aplicação web construída com **React + Vite** e **Tailwind CSS**, integrada com backend Spring Boot.

🌐 **Deploy em produção:** [maisprati-hub.vercel.app](https://maisprati-hub.vercel.app/)

---

## 🚀 Quick Start

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- Backend rodando ([maisprati-hub-server](https://github.com/flaviare1s/maisprati-hub-server))

### Configuração Inicial

1. **Clone o repositório**
```bash
git clone https://github.com/flaviare1s/maisprati-hub.git
cd maisprati-hub
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Execute a aplicação**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🏗️ Estrutura do Projeto

```
src/
├── assets/          # Imagens, ícones e arquivos estáticos
├── components/      # Componentes reutilizáveis (botões, cards, etc)
├── pages/          # Páginas com rotas (Home, Login, Dashboard, etc)
├── contexts/       # Contextos de estado global (Auth, Theme, etc)
├── hooks/          # Hooks customizados
├── services/       # Configuração de APIs e serviços
├── api/            # Funções de API organizadas por domínio
├── App.jsx         # Configuração de rotas
├── main.jsx        # Ponto de entrada da aplicação
└── index.css       # Estilos globais e configuração de temas
```

---

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login, registro e autenticação social (Google)
- 📊 **Dashboard** - Painéis personalizados para estudantes e admins
- 👥 **Teams** - Sistema de equipes/guildas
- 📅 **Calendário** - Agendamento e gestão de reuniões
- 💬 **Fórum** - Sistema de posts e comentários
- 🔔 **Notificações** - Notificações em tempo real
- 👤 **Perfil** - Gerenciamento completo de perfil de usuário

---

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite 5** - Build tool rápido e moderno
- **Tailwind CSS 3** - Framework CSS utilitário
- **React Router 6** - Roteamento client-side
- **Axios** - Cliente HTTP
- **Day.js** - Manipulação de datas
- **Vitest** - Framework de testes

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar testes
npm run test # (Disponível apenas na branch test)

# Lint do código
npm run lint
```

---

## 🔗 Integração com Backend

Este frontend se conecta com a API Spring Boot. Certifique-se de:

1. Clonar e configurar o [backend](https://github.com/flaviare1s/maisprati-hub-server)
2. Iniciar o MongoDB
3. Executar o backend na porta 8080
4. Configurar a variável `VITE_API_BASE_URL` no `.env`

**Endpoints principais:**
- Backend API: `http://localhost:8080/api`
- Swagger Docs: `http://localhost:8080/swagger-ui/index.html`
