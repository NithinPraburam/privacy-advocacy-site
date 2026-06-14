# ReclaimYourData

A full-stack data privacy advocacy website: education, interactive privacy tools, a
personal privacy tracker, and an advocacy hub.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS (dark, high-contrast "activist" theme)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT-based login/signup with bcrypt-hashed passwords

## Project structure

```
privacy-advocacy-site/
├── backend/          Express API, PostgreSQL access, JWT auth, DB schema & seed scripts
└── frontend/         React + Tailwind single-page app (Vite)
```

## Prerequisites

- Node.js 18+ and npm
- A running PostgreSQL instance (local or remote)

## 1. Database setup

Create a database for the project, e.g.:

```bash
createdb privacy_advocacy
```

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials, a strong JWT_SECRET,
# and (optionally) a HaveIBeenPwned API key.

npm install
npm run db:setup   # creates tables
npm run db:seed    # seeds tracker catalog + demo breach data

npm run dev        # starts the API on http://localhost:4000
```

### Environment variables (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | Port the API listens on (default `4000`) |
| `CLIENT_ORIGIN` | Origin allowed by CORS (default `http://localhost:5173`) |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | PostgreSQL connection details |
| `JWT_SECRET` | Secret used to sign JWTs — set this to a long random string |
| `JWT_EXPIRES_IN` | JWT lifetime (default `7d`) |
| `HIBP_API_KEY` | Optional [HaveIBeenPwned API key](https://haveibeenpwned.com/API/Key). Without it, the Breach Checker falls back to seeded demo data. |
| `PRIVACY_NEWS_RSS_URL` | Optional override for the Advocacy page's news RSS feed (default: EFF Deeplinks) |

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev        # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend (configurable via
`VITE_API_PROXY_TARGET` in `frontend/.env`).

## Demo data

- `npm run db:seed` (in `backend/`) inserts:
  - A catalog of suggested privacy actions for the Privacy Tracker
  - Demo breach records for `demo@example.com` and `test@test.com`, used by the
    Breach Checker when no `HIBP_API_KEY` is configured

## Features

- **Home** — Mission statement, privacy stats, and quick links to tools
- **Learn** — Privacy 101 articles, a glossary of key terms, and real-world breach examples
- **Tools**
  - **Privacy Checkup** — A multi-step quiz scoring your privacy 0–100 across social
    media, browser, devices, and apps, with personalized recommendations
  - **Privacy Policy Analyzer** — Paste a privacy policy for an instant keyword-based
    risk rating and summary (runs entirely client-side)
  - **Data Breach Checker** — Checks an email against HaveIBeenPwned (or seeded demo data)
  - **Privacy Tracker** — Logged-in users can track privacy actions and progress over time
- **Advocacy** — Live privacy news feed, a "Wall of Shame," and links to contact representatives
- **Auth** — JWT-based signup/login with hashed passwords; the Privacy Tracker requires an account

## Building for production

```bash
# Frontend
cd frontend && npm run build   # outputs to frontend/dist

# Backend
cd backend && npm start
```

Serve `frontend/dist` via your preferred static host or reverse proxy, and point it
at the backend API.
