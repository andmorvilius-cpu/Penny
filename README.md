# Penny 🪙

A calm, mobile-first budget and spending tracker. Built with Next.js (App
Router), TypeScript, Tailwind CSS, and SQLite via Prisma.

## Running the app

```bash
npm install                 # also runs `prisma generate` (postinstall)
cp .env.example .env        # points DATABASE_URL at a local SQLite file
npx prisma migrate dev      # creates prisma/dev.db and seeds default categories
npm run dev                 # http://localhost:3000
```

Other useful scripts:

| Script | What it does |
| --- | --- |
| `npm run db:migrate` | apply schema changes (after editing `prisma/schema.prisma`) |
| `npm run db:seed` | re-run the category seed (skips if categories exist) |
| `npm run db:studio` | browse the database in Prisma Studio |
| `npm run build` / `npm start` | production build / serve |

### Troubleshooting

- **"Invalid Server Actions request" when submitting a form** — you're opening
  the app through a proxy, tunnel, or cloud preview URL, and Next.js's CSRF
  protection is rejecting the POST because the browser's `Origin` doesn't match
  the `Host` the server sees. The server log prints both values. Put the
  browser-facing host into `ALLOWED_ORIGINS` in `.env` and restart the dev
  server. Plain `localhost:3000` never needs this.
- **"Failed to find Server Action … older or newer deployment"** — different
  error: the browser tab is holding a page from a previous build. Refresh the
  tab (and restart the dev server if it persists).

## Project structure

```
prisma/
  schema.prisma        # data model (Transaction, Category, Budget, RecurringTransaction)
  seed.ts              # default categories (idempotent)
src/
  app/                 # one folder per screen (App Router)
    page.tsx           # home — becomes the calendar view (Feature 2)
    stats/ budgets/ settings/
    layout.tsx         # nav shell + quick-add, shared by every screen
  components/
    nav/AppNav.tsx     # bottom tabs (mobile) / sidebar (desktop)
    quick-add/QuickAdd.tsx  # Feature 1: FAB + add-transaction sheet
  lib/
    db.ts              # Prisma client singleton (server-only)
    money.ts           # THE money utility — cents <-> display strings
    dates.ts           # calendar-day date handling (UTC-midnight convention)
    validation.ts      # Zod schemas for every input
    user.ts            # single-user constant; swap for real auth later
    data/              # read queries (server-only, reusable)
    actions/           # server actions = all mutations
```

## Conventions (the important ones)

- **Money is integer cents.** `amountCents: 1250` means $12.50. Formatting and
  parsing happen only in `src/lib/money.ts`; there is no float money math
  anywhere.
- **No client-side database access.** Client components call server actions
  (`src/lib/actions/`); every action validates its input with Zod before
  writing.
- **Single user, auth-ready.** Every table has a `userId` filled from
  `getCurrentUserId()` (`src/lib/user.ts`). Adding real auth later means
  changing that one function, not the schema.
- **SQLite now, Postgres later.** Change `provider` in `prisma/schema.prisma`
  and `DATABASE_URL` in `.env`; queries don't change. (`src/lib/db.ts`
  normalizes relative SQLite paths and passes other URLs through.)
- **Dates are calendar days** stored as UTC midnight — see `src/lib/dates.ts`
  before touching them.

## Feature status

| # | Feature | Status | Where it lives |
| --- | --- | --- | --- |
| 1 | Quick-add transaction | ✅ | `src/components/quick-add/`, `src/lib/actions/transactions.ts` |
| 2 | Calendar view (home) | ⏳ | `src/app/page.tsx` |
| 3 | Category management | ⏳ | — |
| 4 | Budgets | ⏳ | — |
| 5 | Stats (charts) | ⏳ | — |
| 6 | Recurring transactions | ⏳ | — |
| 7 | CSV export/import | ⏳ | — |
