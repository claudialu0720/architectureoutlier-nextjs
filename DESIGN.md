# Architect Career Test — Design Spec

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind v4 for styling
- better-sqlite3 + Drizzle ORM
- @node-rs/argon2 for password hashing, jose for JWT-signed session cookies
- nanoid for token generation
- Resend for email (deferred setup)
- PM2 for process management, Nginx reverse proxy
- Chart.js via react-chartjs-2

## Repo layout
```
careertest/
├── app/
│   ├── layout.tsx, globals.css, page.tsx          # quiz landing (token gate)
│   ├── result/page.tsx                            # post-submit result view
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── page.tsx                               # dashboard
│   └── api/
│       ├── submit/route.ts
│       ├── admin/login/route.ts
│       ├── admin/logout/route.ts
│       ├── admin/tokens/route.ts                  # GET list, POST create
│       ├── admin/tokens/[id]/route.ts             # PATCH revoke
│       ├── admin/tokens/export/route.ts           # GET csv
│       └── admin/settings/route.ts                # GET, PATCH
├── lib/
│   ├── db/{client.ts, schema.ts, migrations/}
│   ├── quiz/{questions.ts, archetypes.ts, score.ts}
│   ├── auth/{session.ts, middleware.ts}
│   ├── email/send.ts
│   └── tokens.ts
├── components/                                    # quiz UI, result UI, HUD primitives
├── public/results/                                # all images from imgstore/
├── scripts/hash-password.ts
├── data/                                          # local sqlite (gitignored)
├── drizzle.config.ts
├── next.config.ts                                 # basePath: '/test'
├── middleware.ts
├── ecosystem.config.cjs                           # PM2 config
└── .env.local / .env.production
```

## Configuration via env
```
DATABASE_PATH=./data/data.db                       # /var/lib/careertest/data.db in prod
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$argon2id$...
SESSION_SECRET=<openssl rand -base64 32>
PORT=3001                                          # avoid collision with the other Next app
RESEND_API_KEY=                                    # leave blank in dev
EMAIL_FROM="Architect Career Test <noreply@abc.com>"
PUBLIC_BASE_URL=https://abc.com/test
```

## Routing (with basePath: '/test')
| URL                      | Purpose                                              |
|--------------------------|------------------------------------------------------|
| `/test/?t=XYZ`           | Quiz; reads token from `t` param                     |
| `/test/?t=XYZ` (used)    | Renders stored result for that token                 |
| `/test/admin/login`      | Admin login form                                     |
| `/test/admin`            | Token dashboard + settings                           |
| `/test/api/...`          | All API routes                                       |

Bare `/test/` with no token → "this test is invitation-only" page.

## Database schema
```ts
tokens {
  id           text primary key      // nanoid(16)
  order_id     text                  // nullable, indexed
  label        text                  // nullable
  state        text                  // 'created' | 'completed' | 'revoked'
  email        text                  // captured on submit, nullable
  email_sent   integer               // 0/1
  answers      text                  // JSON, raw answer array
  scores       text                  // JSON, e.g. {"D":4,"T":8,...}
  archetype    text                  // e.g. "B+T", "fallback"
  result_image text                  // filename in /public/results
  created_at   integer               // unix ms
  completed_at integer               // unix ms, nullable
}
// indexes: order_id, state, created_at

settings { key text primary key, value text }
```

## Token lifecycle
- **Create:** state `created`, URL = `${PUBLIC_BASE_URL}/?t=${id}`
- **Visit:** `created` → render quiz; `completed` → render stored result; `revoked`/unknown → invalid link
- **Resume:** partial answers in localStorage keyed by token id; no server write until submit
- **Submit:** validates state==`created`, scores answers, writes results, flips to `completed`, optionally emails. Atomic transaction.
- **Revoke:** admin flips `created` → `revoked`. `completed` tokens cannot be revoked.
- **No expiration**

## Quiz config (extensibility)
Three flat, typed files. Adding questions or archetypes = config edit, no logic changes.

```ts
// lib/quiz/questions.ts
export type Trait = 'D' | 'T' | 'B' | 'N' | 'C' | 'S';
export type Question = {
  id: string;                                      // stable id for analytics across changes
  q: string;
  options: Array<{
    label: string;                                 // 'A'/'B'/'C'/'D' shown in UI
    text: string;
    weights: Partial<Record<Trait, number>>;
  }>;
};
export const questions: Question[] = [ ... ];
```

Stored answers reference the stable `id`, not array index — reordering/inserting questions later doesn't break historical data.

## Admin dashboard (v1)
- Login page with rate limit (5 attempts / IP / minute)
- **Generate tokens** — Batch (count 1–500 + optional label) and Single (required orderID + optional label)
- **Tokens table** — paginated, filterable by state/orderID/label
- **Result detail view**
- **CSV export** — all tokens with metadata + scores + archetype + answers
- **Settings panel** — toggle: email results to users
- Logout

## Auth
- argon2 hash in env. Login → JWT (HS256, 7-day) in httpOnly + Secure + SameSite=Lax cookie scoped to `/test/admin` and `/test/api/admin`
- `middleware.ts` guards admin routes (except `/login`)

## Email
- `lib/email/send.ts` thin wrapper. No-op if `EMAIL_ENABLED` setting false. Console-log if `RESEND_API_KEY` unset (dev). Otherwise Resend API.
- Email body: archetype name + description + image + link back to `/test/?t=XYZ`
- Failures logged but never block result response
- `email_sent` flag on tokens table

## Deployment
- Build on box (or rsync `.next/`, `public/`, `package.json`, `node_modules/`)
- PM2: `pm2 start npm --name careertest -- start` with PORT=3001
- Nginx (alongside existing app):
  ```
  location /test/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  ```
  Don't strip `/test` — Next sees full path because of basePath.
- SQLite at `/var/lib/careertest/data.db`; daily `sqlite3 .backup` cron to S3 post-launch

## Implementation phases
1. Scaffold — Next.js, Tailwind, basePath, Drizzle, env, PM2 file
2. Quiz port — questions/archetypes/scoring → `lib/quiz/*`, images → `public/results/`, quiz + result UI
3. Token system — table, validation, lifecycle, `/api/submit`, localStorage resumability
4. Admin auth — login, JWT, middleware, rate limit, hash-password script
5. Admin dashboard — token generation (both modes), table, revoke, view result
6. CSV export
7. Email — settings toggle, capture UI, Resend wrapper (deferred account/DNS setup)
8. Deploy dry-run on AWS box

## Decisions locked in
- Token expiration: none
- Email from: `noreply@abc.com` / "Architect Career Test"
- Quiz flow: linear, no branching (extensible later)
- Hosting: AWS instance, Nginx → PM2 → Next.js on PORT=3001
- DB: SQLite, path via `DATABASE_PATH` env var (`./data/data.db` in dev, `/var/lib/careertest/data.db` in prod)
- Locale: zh-CN only on user-facing UI
