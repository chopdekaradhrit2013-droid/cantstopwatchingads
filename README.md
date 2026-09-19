# CAN’T STOP WATCHING ADS

Viewer website MVP. Discover, search, like, save, and follow advertisements.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Dummy catalog in `src/lib/data.ts`
- Client state + persistence in `src/lib/store.tsx` (localStorage)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` Home
- `/explore` Search, filters, sort
- `/ads/[id]` Advertisement details
- `/brands` and `/brands/[slug]`
- `/saved` `/notifications` `/signup` `/login` `/profile`

CREATE (brand upload) is not in this repo.
