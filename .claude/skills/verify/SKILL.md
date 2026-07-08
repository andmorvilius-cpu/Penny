---
name: verify
description: Build, launch, and drive the Penny app end-to-end to verify a change works at the UI surface.
---

# Verifying Penny

## Build & launch

```bash
npm run build                       # production build (Turbopack), catches TS errors
(npm start > /tmp/server.log 2>&1 &) # serves on :3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/   # expect 200
```

First-time setup on a fresh clone: `cp .env.example .env && npx prisma migrate dev`
(creates prisma/dev.db and seeds default categories).

## Drive with Playwright

Use `playwright-core` (install in a scratch dir, NOT the project) with the
pre-installed browser:

```js
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
// mobile: viewport 390x844; desktop: 1280x800; dark: colorScheme: "dark"
```

Useful selectors: FAB is `getByRole("button", { name: "Add transaction" })`;
the sheet is `getByRole("dialog")`; category grid buttons are named with their
emoji included (e.g. `"💰 Income"`).

## Gotchas learned the hard way

- **Port 3000 stale server**: a leftover `next start` holds the port and serves
  chunks from a `.next` that was rebuilt underneath it → pages render but
  hydration dies (buttons do nothing). Before starting, free the port with
  `fuser -k 3000/tcp`. Check server.log for EADDRINUSE after starting.
- **Don't `pkill -f "next start"`** — the pattern matches your own shell's
  command line and kills it (exit 144). Use `fuser -k 3000/tcp` or a bracket
  pattern like `pgrep -f "nex[t] start"`.
- **First click can beat hydration**: retry the opening click until the dialog
  appears instead of clicking once.
- **Reset state between runs**: transactions persist in prisma/dev.db. Clear with
  `npx tsx -e "import {PrismaClient} from './src/generated/prisma/client'; const p=new PrismaClient({datasourceUrl:'file:'+process.cwd()+'/prisma/dev.db'}); p.transaction.deleteMany({}).then(()=>p.\$disconnect())"`
- Relative `file:` DATABASE_URL is resolved against `prisma/` by
  `src/lib/db.ts` — the actual db file is `prisma/dev.db`.

## Flows worth driving

- Quick-add: FAB → amount → category grid (+ subcategory chips) → submit →
  row appears on home. Probe: empty amount, garbage amount ("12.3.4"),
  missing category, comma amounts ("1,000"), reload persistence.
