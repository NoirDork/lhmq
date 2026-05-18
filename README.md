# studio.folio — Editorial Portfolio

A minimalist creative portfolio built with **React 19**, **TanStack Start** (Vite 7), **Tailwind CSS v4**, and **Framer Motion 12**.

---

## Prerequisites

Install one of the following on your laptop:

- **Node.js** ≥ 20 (recommended LTS): https://nodejs.org
- **Bun** ≥ 1.1 (optional, faster): https://bun.sh
- **Git**: https://git-scm.com

Check versions:

```bash
node -v
git --version
```

---

## 1. Clone the project

If the project is connected to GitHub, copy the repo URL from GitHub and run:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Or, if you downloaded the codebase ZIP from Lovable:

```bash
unzip <downloaded-file>.zip
cd <unzipped-folder>
```

---

## 2. Install dependencies

Using **npm**:

```bash
npm install
```

Or using **bun** (faster):

```bash
bun install
```

---

## 3. Run the dev server

```bash
npm run dev
# or
bun dev
```

Open the printed URL (usually <http://localhost:5173>).

---

## 4. Other scripts

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start the local dev server with HMR   |
| `npm run build`    | Production build                      |
| `npm run preview`  | Preview the production build locally  |
| `npm run lint`     | Run ESLint                            |
| `npm run format`   | Format code with Prettier             |

Replace `npm run` with `bun` if you prefer Bun (e.g. `bun dev`, `bun run build`).

---

## Tech stack

- React 19 + TypeScript
- TanStack Start (Vite 7) — file-based routing in `src/routes/`
- Tailwind CSS v4 (configured via `src/styles.css`)
- Framer Motion 12 — animations and micro-interactions
- Lucide React — icons

## Project structure

```
src/
├── routes/              # File-based routes (TanStack)
│   ├── __root.tsx
│   └── index.tsx        # Home page
├── components/
│   └── portfolio/       # Hero, Navbar, Work, Services, Contact, …
├── styles.css           # Tailwind v4 theme + design tokens
└── router.tsx
```

---

## Troubleshooting

- **Port in use** — run `npm run dev -- --port 3000` to pick another port.
- **Node too old** — install Node ≥ 20 via [nvm](https://github.com/nvm-sh/nvm).
- **Tailwind classes not applying** — restart the dev server after editing `src/styles.css`.
