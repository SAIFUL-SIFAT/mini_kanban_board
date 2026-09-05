<div align="center">

# KANBAN // RETRO

**Drag. Drop. Ship Faster.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%E2%86%92%20Open%20App-15803D?style=for-the-badge&logo=vercel&logoColor=white)](https://mini-kanban-board-nine.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

<div align="center">

### 🔗 [mini-kanban-board-nine.vercel.app](https://mini-kanban-board-nine.vercel.app/)

![Kanban // Retro — App Preview](docs/screenshots/preview.png)

> A full-stack Kanban board with drag-and-drop reordering, multi-user board sharing, JWT auth, and a distinctive neo-brutalist retro UI.

</div>

---

##  Features

| Feature | Details |
|---|---|
|  **Auth** | JWT-based login & registration with `bcrypt` hashing |
|  **Boards** | Create, name, and manage multiple Kanban boards |
|  **Columns** | Add / reorder custom columns per board |
|  **Tasks** | Create tasks with titles, descriptions, and priority labels |
|  **Drag & Drop** | Optimistic DnD reordering within and across columns |
|  **Board Sharing** | Invite users by email with OWNER / MEMBER roles |
|  **Neo-Brutalist UI** | 2px crisp black borders, offset hard shadows, Space Grotesk typography |
|  **Responsive** | Works on desktop and mobile |

---

##  Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** — App Router, Server Components, TypeScript
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Lightweight client state
- **[dnd-kit](https://dndkit.com/)** — Accessible drag-and-drop

### Backend
- **[NestJS 12](https://nestjs.com/)** — Modular, typed Node.js framework (ESM)
- **[Prisma ORM](https://www.prisma.io/)** — Type-safe DB access with migrations
- **[PostgreSQL](https://www.postgresql.org/)** — Relational database
- **[Passport JWT](https://www.passportjs.org/)** — Stateless authentication

### Infrastructure
- **Frontend** → [Vercel](https://vercel.com/)
- **Backend** → [Render](https://render.com/)
- **Database** → [Render PostgreSQL](https://render.com/docs/databases)

---

##  Project Structure

```
mini_kanban_board/
├── frontend/                  # Next.js 15 (App Router, TypeScript)
│   └── src/
│       ├── app/               # Pages & layouts
│       ├── components/
│       │   ├── common/        # AvatarInitials, EmptyState
│       │   ├── kanban/        # Column, TaskCard, dialogs
│       │   └── ui/            # shadcn/ui primitives
│       ├── stores/            # Zustand state
│       └── lib/               # API client, utils
│
├── backend/                   # NestJS 12 (TypeScript, ESM)
│   └── src/
│       ├── auth/              # JWT strategy, guards
│       ├── boards/            # Board CRUD + sharing
│       ├── columns/           # Column CRUD + ordering
│       ├── tasks/             # Task CRUD + positional logic
│       └── prisma/            # PrismaService & PrismaModule
│   └── prisma/
│       └── schema.prisma      # User, Board, Column, Task models
│
├── docs/screenshots/          # App preview images
└── docker-compose.yml         # Local PostgreSQL
```

---

##  Local Development

### Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL) **or** a remote DB

### 1. Clone & Install

```bash
git clone https://github.com/SAIFUL-SIFAT/mini_kanban_board.git
cd mini_kanban_board
cd frontend && npm install && cd ../backend && npm install
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

`backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_kanban?schema=public"
PORT=3005
JWT_SECRET=your-super-secret-key
```

`frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3005
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Migrate & Start

```bash
# Apply DB migrations
cd backend && npx prisma migrate dev

# Start backend  →  http://localhost:3005
npm run start:dev

# New terminal — start frontend  →  http://localhost:3000
cd frontend && npm run dev
```

---

##  Deployment
| Service | Platform | Root Dir |
|---|---|---|
| Frontend | Vercel | `frontend` |
| Backend | Render Web Service | `backend` |
| Database | Render PostgreSQL | — |

**Render — Build Command:**
```bash
npm install && npm run build && npx prisma generate
```

**Render — Start Command:**
```bash
npx prisma migrate deploy && npm run start:prod
```

**Render env vars:**
```env
DATABASE_URL=postgresql://...        # Internal DB URL from Render
PORT=3001
JWT_SECRET=...                       # openssl rand -base64 32
FRONTEND_URL=https://your-app.vercel.app
```

**Vercel env vars:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

##  Database Schema

```
User ──< BoardMember >── Board ──< Column ──< Task
```

- **`User`** — Auth entity with hashed password
- **`Board`** — Container owned by a user, shared with members
- **`BoardMember`** — Join table with `OWNER | MEMBER` roles
- **`Column`** — Ordered stage within a board
- **`Task`** — Card with title, description, priority, and float position index

---

##  License

MIT © [SAIFUL-SIFAT](https://github.com/SAIFUL-SIFAT)
