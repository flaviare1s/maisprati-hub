# +praTiHub - Frontend

[![Português](https://img.shields.io/badge/lang-pt--BR-green)](README.md)
[![English](https://img.shields.io/badge/lang-en-blue)](README.en.md)

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

Web application built with **React + Vite** and **Tailwind CSS**, integrated with Spring Boot backend.

🌐 **Production deployment:** [maisprati-hub.vercel.app](https://maisprati-hub.vercel.app/)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- Backend running ([maisprati-hub-server](https://github.com/flaviare1s/maisprati-hub-server))

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/flaviare1s/maisprati-hub.git
cd maisprati-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Edit the `.env` file with your settings:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Run the application**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Project Structure

```
src/
├── assets/          # Images, icons and static files
├── components/      # Reusable components (buttons, cards, etc)
├── pages/          # Pages with routes (Home, Login, Dashboard, etc)
├── contexts/       # Global state contexts (Auth, Theme, etc)
├── hooks/          # Custom hooks
├── services/       # API configuration and services
├── api/            # API functions organized by domain
├── App.jsx         # Routes configuration
├── main.jsx        # Application entry point
└── index.css       # Global styles and theme configuration
```

---

## ✨ Features

- 🔐 **Authentication** - Login, register and social authentication (Google)
- 📊 **Dashboard** - Customized panels for students and admins
- 👥 **Teams** - Team/guild system
- 📅 **Calendar** - Meeting scheduling and management
- 💬 **Forum** - Posts and comments system
- 🔔 **Notifications** - Real-time notifications
- 👤 **Profile** - Complete user profile management

---

## 🛠️ Technologies

- **React 18** - JavaScript library for interfaces
- **Vite 5** - Fast and modern build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Day.js** - Date manipulation
- **Vitest** - Testing framework

---

## 📝 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test # (Available only on test branch)

# Code lint
npm run lint
```

---

## 🔗 Backend Integration

This frontend connects to the Spring Boot API. Make sure to:

1. Clone and configure the [backend](https://github.com/flaviare1s/maisprati-hub-server)
2. Start MongoDB
3. Run the backend on port 8080
4. Configure the `VITE_API_BASE_URL` variable in `.env`

**Main endpoints:**
- Backend API: `http://localhost:8080/api`
- Swagger Docs: `http://localhost:8080/swagger-ui/index.html`
