# SniperFlow

## SQLite Local - 100% Gratuito e Ilimitado

Sistema completo de prospecção de leads (SniperFlow) com banco de dados SQLite local.

## 🚀 Iniciar com Docker

```bash
docker-compose up -d
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Estrutura

```
├── backend/              # Express + SQLite
│   ├── src/
│   │   ├── database.js   # SQLite + CRUD
│   │   ├── server.js     # API REST
│   │   └── seed.js       # Dados iniciais
│   └── Dockerfile
├── src/                  # React Frontend
│   ├── lib/api.ts        # Cliente API
│   └── hooks/            # React Query hooks
├── data/                 # SQLite database (auto-criado)
│   └── leadscan.db
└── docker-compose.yml
```

## 🔧 Sem Docker (desenvolvimento)

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
npm install
npm run dev
```

## ✅ SQLite local, ilimitado e 100% gratuito integrado. Sem Supabase, sem custo.
