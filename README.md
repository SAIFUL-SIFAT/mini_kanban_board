# Mini Kanban Board

A modern full-stack Kanban board application built with:
- **Frontend**: [Next.js](https://nextjs.org/) (App Router, TypeScript) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)

---

## Project Structure

```
mini_kanban_board/
├── frontend/             # Next.js 16 (App Router, TS, Tailwind CSS)
│   ├── src/
│   │   └── app/          # App router pages, layouts, and styles
│   ├── public/           # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/              # NestJS 12 (TypeScript, ESM)
│   ├── src/
│   │   ├── prisma/       # PrismaService & PrismaModule
│   │   ├── app.module.ts
│   │   └── main.ts       # Runs on port 3001 with CORS enabled
│   ├── prisma/
│   │   └── schema.prisma # Board, Column, Task models
│   ├── .env.example      # Sample environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── package.json          # Root scripts for running both services
└── README.md
```

---

## Quick Start

### 1. Configure Backend Environment
Copy the example environment file in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Update `DATABASE_URL` in `backend/.env` with your PostgreSQL database credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_kanban?schema=public"
PORT=3001
```

### 2. Generate Prisma Client / Run Migrations
```bash
# Generate Prisma Client
npm run prisma:generate

# Apply migrations when your PostgreSQL database is running
npm run prisma:migrate
```

### 3. Start Development Servers
You can run both services from the root:
```bash
# Start frontend (http://localhost:3000)
npm run dev:frontend

# Start backend (http://localhost:3001)
npm run dev:backend
```

Or run them individually inside each directory:
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev
```

---

## Database Models (Prisma)
- **`Board`**: Container for columns and tasks.
- **`Column`**: Kanban stages (`To Do`, `In Progress`, `In Review`, `Done`).
- **`Task`**: Kanban items with titles, descriptions, and ordering.
