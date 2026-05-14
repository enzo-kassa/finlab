# FinLab — Guia de instalação

## Estrutura do projeto

```
finlab/
├── frontend/   ← React (Vite)
└── backend/    ← NestJS (API REST)
```

---

## 1. Rodar o Backend (NestJS)

```bash
cd backend
npm install
npm install @nestjs/config
npm run start:dev
```

O backend sobe em: http://localhost:3000
Endpoint de leads: POST http://localhost:3000/leads

---

## 2. Rodar o Frontend (React)

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev
```

O frontend sobe em: http://localhost:5173

---

## Variáveis de ambiente

O arquivo `backend/.env` já está configurado com as credenciais do Supabase.
**Nunca suba o .env para o Git.**

Adicione ao `.gitignore`:
```
.env
node_modules/
dist/
```

---

## Fluxo da aplicação

```
Usuário preenche simulador (React)
        ↓
Modal de captura de lead
        ↓
POST /leads  →  NestJS (backend)
        ↓
LeadsController → LeadsService
        ↓
Supabase (PostgreSQL)
  ├── users
  ├── user_financial_profile
  └── user_goals
```

---

## Endpoints da API

| Método | Rota     | Descrição              |
|--------|----------|------------------------|
| POST   | /leads   | Cadastra novo lead     |

### Exemplo de body (POST /leads)

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "openToPropose": true,
  "presentAmount": 10000,
  "monthlyInvestment": 500,
  "monthlyRate": 0.9,
  "goals": [
    {
      "type": "house",
      "label": "CASA",
      "targetValue": 400000,
      "targetMonths": 120
    }
  ]
}
```
