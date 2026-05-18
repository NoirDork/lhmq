# 🎓 Graduation Invitation

A modern, elegant graduation invitation website built with **React 19**, **TanStack Start** (Vite 7), **Tailwind CSS v4**, and **Framer Motion 12**.

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

## Sections

| Section | ID | Description |
|---|---|---|
| Hero | `#home` | Invitation headline, personal message, CTA buttons |
| Invitation | `#invitation` | Graduate details (name, university, major, class, ID) |
| About | `#about` | Journey story and milestone highlights |
| Event Details | `#details` | Date, time, venue, dress code, guest notes |
| Memories | `#memories` | 6 memory cards → each opens a detail page with image slider |
| Timeline | `#timeline` | Event schedule (arrival → ceremony → dinner) |
| RSVP | `#rsvp` | Contact form with EmailJS for wishes & attendance |

## Tech stack

- React 19 + TypeScript
- TanStack Start (Vite 7) — file-based routing in `src/routes/`
- Tailwind CSS v4 (configured via `src/styles.css`)
- Framer Motion 12 — animations and micro-interactions
- Embla Carousel — image sliders on memory pages
- EmailJS — form submission
- Lucide React — icons

## Project structure

```
src/
├── routes/                    # File-based routes (TanStack)
│   ├── __root.tsx             # Root layout, 404, error boundary
│   ├── index.tsx              # Home page
│   └── memory.$slug.tsx       # Memory detail pages with image carousel
├── components/
│   ├── portfolio/             # Navbar, Hero, Introduction, About, Work,
│   │                          # Gallery, Services, Contact, ContactForm,
│   │                          # Footer, Signature, Reveal, SectionTitle,
│   │                          # ThemeToggle, ProjectCard
│   └── ui/                    # shadcn/ui primitives (button, card,
│                              # carousel, dialog, etc.)
├── lib/
│   ├── utils.ts               # cn() helper
│   ├── error-capture.ts       # SSR error capture
│   └── error-page.ts          # Branded error page HTML
├── hooks/
│   └── use-mobile.tsx         # Mobile detection hook
├── styles.css                 # Tailwind v4 theme + design tokens
├── router.tsx                 # Router factory
├── server.ts                  # Cloudflare Workers SSR entry
└── start.ts                   # TanStack Start instance
```

---

## Configuration

### Required before running

1. **EmailJS** — Replace `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, `YOUR_PUBLIC_KEY` in `ContactForm.tsx:5-7`
2. **Personal info** — Update placeholder name, email, university, dates across components
3. **Images** — Replace `picsum.photos` URLs in `memory.$slug.tsx:11-13` with your own photos

---

## Troubleshooting

- **Port in use** — run `npm run dev -- --port 3000` to pick another port.
- **Node too old** — install Node ≥ 20 via [nvm](https://github.com/nvm-sh/nvm).
- **Tailwind classes not applying** — restart the dev server after editing `src/styles.css`.
