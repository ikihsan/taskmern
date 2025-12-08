# Pulse Tasks

Pulse Tasks is the project I would ship for a MERN machine test if I had one shot to impress. It keeps track of users, their tasks, and their evidence (attachments) while a nightly cron job quietly flags anything that slips past its due date.

## Why it feels complete

- **Real authentication** – register/login flows backed by JWT, bcrypt hashing, and guarded routes.
- **Opinionated task model** – title, due date, status, attachment, owner, timestamps, and validation baked in.
- **File uploads that matter** – Multer stores images/PDFs in `backend/uploads`, React shows previews, and cleanup runs automatically.
- **Autopilot for overdue work** – a `node-cron` job runs nightly (timezone configurable) to flip any unfinished, past-due task to `overdue`.
- **Contemporary UI** – a single-page React app (Vite + TS + React Query + Router) with gradients, badges, modal editing, and inline previews.

## Tech snapshot

| Layer | What’s inside |
| --- | --- |
| Backend | Node 18+/Express 5, Mongoose 9, JWT, Multer, node-cron, Zod |
| Frontend | Vite 5, React 19 (TS), React Router 7, React Query 5, Axios |
| Database | MongoDB (local Docker or Atlas URI) |

## Quick start

> Requirements: Node 18.18+ (or 20.19+), npm, and a MongoDB instance you can reach (defaults to `mongodb://127.0.0.1:27017`).

1. **Clone and install**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment**
   Copy `.env.example` → `.env` in the repo root and tweak values. Minimum keys:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mern_machine_test
   JWT_SECRET=replace-with-strong-secret
   CLIENT_URL=http://localhost:5173
   CRON_TZ=UTC
   VITE_API_URL=http://localhost:5000
   ```
   - `CLIENT_URL` can be comma-separated if you allow several origins.
   - `VITE_API_URL` is the endpoint the React app hits.

3. **Run it locally**
   ```bash
   # Terminal A – API + cron
   cd backend
   npm run dev

   # Terminal B – React client
   cd frontend
   npm run dev
   ```
   - API listens on `PORT` (default 5000). Routes: `/auth/*`, `/tasks/*`, `/uploads/*`.
   - Frontend boots on `5173`, consumes `VITE_API_URL`, and hot-reloads.

4. **Production-ish build**
   ```bash
   cd backend && npm run start      # runs server with cron + Mongo
   cd frontend && npm run build && npm run preview
   ```

## API at a glance

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a user → `{ token, user }` |
| POST | `/auth/login` | Authenticate → `{ token, user }` |
| GET | `/tasks` | List current user’s tasks |
| POST | `/tasks` | Create task + optional `attachment` (multipart) |
| PUT | `/tasks/:id` | Update title/status/dueDate/attachment |
| DELETE | `/tasks/:id` | Delete task and remove stored file |

Validation rules: title + due date required; status ∈ `todo | in-progress | completed | overdue`; attachments must be images or PDFs up to 5 MB. Errors use `{ success: false, message, errors? }`.

## Overdue engine

- Located in `backend/src/jobs/overdueCron.js`.
- Schedule `0 0 * * *` (midnight) in `CRON_TZ` timezone.
- On server boot we also run the same query once so stale data gets caught immediately.
- Logic: `status !== 'completed'` and `dueDate < startOfToday` ⇒ status becomes `overdue`.

## Frontend highlights

- Auth pages with inline validation and storage-backed sessions.
- Dashboard shows totals, overdue counts, and the full task grid.
- Add/edit forms support uploads, status changes, and due date picking.
- Attachments preview inline when they’re images and link out for PDFs.

## Folder map

```
backend/
  src/
    config/ controllers/ middleware/ models/ routes/ jobs/
frontend/
  src/
    components/ context/ hooks/ pages/ services/ styles/ types/
```

## Future ideas

- Pagination or filters on `/tasks`.
- Priority field + sorting.
- Move uploads to cloud storage (S3, Azure Blob) for production durability.
- Automated tests (Jest for API, Cypress/Playwright for UI).

## Troubleshooting

- **Mongo errors** → confirm `MONGO_URI` is reachable and the server is running.
- **CORS complaints** → double-check `CLIENT_URL` contains the frontend origin(s).
- **Vite warnings about Node** → upgrade Node to 18.18+ or 20.19+; Vite 5 enforces that.

Once everything is running, register a user, drop in a few tasks with attachments, and wait for midnight (or bump the system clock) to watch overdue automation kick in. Good luck with your machine test! 💪
