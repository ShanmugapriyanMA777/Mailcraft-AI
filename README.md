# MailCraft AI

> AI-powered email writing assistant that helps you generate professional emails in seconds, powered by Google Gemini 2.5 Flash.

MailCraft AI is a fullstack web application built with Next.js (App Router), Drizzle ORM, PostgreSQL, and the Google Gemini API. It features 8 AI tools (email generator, grammar checker, rewrite, translate, subject generator, smart reply, templates, and history) wrapped in a clean, premium dashboard with dark mode.

## ✨ Features

- **AI Email Generator** — craft professional emails with custom tone, length, and language
- **Grammar Checker** — fix grammar, vocabulary, and structure
- **Rewrite Email** — make it more professional, friendly, formal, polite, shorter, longer, simpler, or stronger
- **Translate** — translate to/from 9 languages
- **Subject Generator** — generate 10 compelling subject lines
- **Smart Reply** — generate short, professional, friendly, decline, or accept replies
- **Templates** — 28 curated templates across 14 categories
- **History** — save, search, filter, copy, download, and delete past emails
- **Profile & Settings** — avatar upload, password change, dark mode, defaults, notifications
- **Auth** — secure email/password + Google sign-in (configurable)

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide icons, Sonner toasts
- **Backend**: Next.js API routes, Zod validation, JWT (jose), bcryptjs, rate limiting
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Exports**: jsPDF, docx, file-saver

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # login, register, forgot-password
│   ├── dashboard/           # protected dashboard pages
│   │   ├── page.tsx         #   Email Generator
│   │   ├── grammar/
│   │   ├── rewrite/
│   │   ├── translate/
│   │   ├── subjects/
│   │   ├── smart-reply/
│   │   ├── templates/
│   │   ├── history/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/            # register, login, logout, me, forgot-password
│   │   ├── ai/              # generate, grammar, rewrite, translate, subjects, smart-reply
│   │   ├── history/         # GET/POST + DELETE /[id]
│   │   ├── templates/
│   │   └── profile/
│   ├── layout.tsx
│   ├── page.tsx             # landing
│   └── globals.css
├── components/
│   ├── ui/                  # button, card, input, select, badge, tabs, label, skeleton
│   ├── marketing/           # navbar, footer
│   ├── dashboard/           # sidebar, topbar, email-output
│   ├── theme-provider.tsx
│   └── auth-provider.tsx
├── db/
│   ├── index.ts             # Drizzle client
│   ├── schema.ts            # users, email_history, templates, sessions
│   └── seed.ts              # template seeder
└── lib/
    ├── auth.ts              # JWT, bcrypt, cookies
    ├── gemini.ts            # all AI functions, rate limiting
    └── utils.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- A PostgreSQL database (local or hosted)
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
# PostgreSQL connection
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# JWT secret — use a long random string in production
JWT_SECRET=change-me-to-a-long-random-string

# Google Gemini API key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Set up the database

Push the schema to your database:

```bash
npx drizzle-kit push
```

Seed the templates table:

```bash
npx tsx src/db/seed.ts
```

(Or use `npm run seed` if added to your scripts.)

### 4. Run in development

```bash
npm run dev
```

Visit http://localhost:3000.

### 5. Build & run production

```bash
npm run build
npm run start
```

## 🌍 Environment Variables

| Variable        | Description                                  | Required |
| --------------- | -------------------------------------------- | -------- |
| `DATABASE_URL`  | PostgreSQL connection string                 | Yes      |
| `JWT_SECRET`    | Secret for signing auth tokens               | Yes      |
| `GEMINI_API_KEY`| Google Gemini 2.5 Flash API key              | Yes (for AI features) |
| `NODE_ENV`      | `production` in deployed environments        | No       |

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — sign in
- `POST /api/auth/logout` — sign out
- `GET  /api/auth/me` — get current user
- `POST /api/auth/forgot-password` — reset password

### AI (rate-limited, auth required)
- `POST /api/ai/generate` — full email generator
- `POST /api/ai/grammar` — fix grammar
- `POST /api/ai/rewrite` — rewrite in a style
- `POST /api/ai/translate` — translate to a language
- `POST /api/ai/subjects` — generate 10 subject lines
- `POST /api/ai/smart-reply` — generate a reply

### Data
- `GET  /api/history` — search/filter history
- `POST /api/history` — save an email
- `DELETE /api/history/[id]` — delete one
- `GET  /api/templates` — list templates
- `PATCH /api/profile` — update name/avatar/preferences
- `PUT  /api/profile` — change password

## 🗃 Database Schema

```
users           id, name, email, password_hash, avatar, preferences, created_at
email_history   id, user_id, topic, subject, recipient, tone, language, length, generated_email, feature, created_at
templates       id, category, title, content, created_at
sessions        id, user_id, token, expires_at, created_at
```

## 🔐 Security

- Passwords hashed with **bcryptjs** (10 rounds)
- JWT tokens in **httpOnly** cookies
- Zod-validated request bodies
- **In-memory rate limiting** (30 requests/hour/user)
- Foreign key cascades on user delete
- Auth required on all AI/data endpoints

## 🎨 Design

- **Theme**: white and blue with glassmorphism accents
- **Typography**: Inter via system font stack
- **Rounded cards**, soft shadows, subtle Framer Motion animations
- **Mobile-first** responsive layout
- **Dark mode** with smooth transitions

## 📦 Deployment

- **Frontend + Backend**: any Node.js host (Vercel works great for Next.js)
  - Set the three environment variables in your platform
  - Run `npx drizzle-kit push` against your hosted DB once
  - Seed templates: `npx tsx src/db/seed.ts`
- **Database**: Supabase, Neon, Railway, or any managed PostgreSQL

## 📄 License

MIT
