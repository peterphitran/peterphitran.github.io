# CONTEXT.md — Portfolio

Living context + issue log for this project. Keep it current: when something non-trivial
is investigated or fixed, add/update an entry in the **Issue Log** below.
See `../CLAUDE.md` for the global working agreements.

---

## 1. What this is

Personal portfolio website — a static site built with **Astro 5 + React 19 + Tailwind CSS v4**.

- `src/pages/index.astro` — main landing page (hero, about, skills, experience, projects, volunteer, certifications, contact)
- `src/pages/gallery/` — photo gallery (currently "Coming Soon" placeholder)
- `src/pages/open-source/` — OSS blog: listing at `/open-source`, posts at `/open-source/[slug]`
- `src/content/open-source/` — Markdown posts (frontmatter: `title`, `date`, `excerpt`)
- `src/components/` — Astro/React components, organized under `landing/`
- `src/content/` — YAML/image assets for experiences, projects, volunteer, gallery
- `src/images/` — static assets (headshot, etc.)

### Key tech / decisions
- **Bun** package manager + **Astro** static site generator.
- **Tailwind CSS v4** via `@tailwindcss/vite`.
- **astro-icon** with Iconify icon sets (`devicon`, `fa7-solid`).
- **Raleway** variable font via `@fontsource-variable/raleway`.
- Content driven by Astro content collections (`src/content/config.ts`).

### Common commands
```bash
bun install         # install dependencies
bun dev             # start Astro dev server (astro dev)
bun run build       # production build (astro build)
bun run preview     # preview production build (astro preview)
bun run lint        # ESLint
```

### Environment notes
- Runs in **Windows** (native `bun`). Path: `c:/Users/ptran/Downloads/Projects/portfolio`.
- Uses official bun (`~/.bun/bin/bun`) — do NOT use snap bun.
- **Build must use WSL + Node 24.14.1**: run via `wsl bash -c ". /home/ptran/.nvm/nvm.sh; nvm use 24.14.1; cd /mnt/c/.../portfolio && ~/.bun/bin/bun run build"`
- Astro 5 content collection `id` includes the `.md` extension — strip it when building URLs (`post.id.replace(/\.md$/, '')`).
- No test suite configured.

---

## 2. Current goal / task

Polish and extend the personal portfolio site. Recently shipped the Open Source blog section — Markdown-driven posts at `/open-source` with a listing index and individual post pages, accessible via the navbar.

---

## 3. Issue Log

> Format per entry: Symptom → Root cause → Tried → Fix → Status → Alternatives.

_(No issues logged yet — log future investigations here.)_

---

## 4. Open items / watch list

- Gallery page is "Coming Soon" — real photo gallery not yet implemented.
- No deployment pipeline configured yet.

---

## 5. Scratchpad

- 2026-06-15: Onboarded project. Stack detected: Astro 5 + React 19 + Tailwind v4 + Bun. CONTEXT.md created.
- 2026-06-15: Implemented open source blog section. New Astro content collection at `src/content/open-source/`, listing page at `/open-source`, post page at `/open-source/[slug]`. Navbar updated (desktop + mobile). Sample post at `getting-started.md`. Fixed Astro 5 `.md` extension in `post.id` for clean URLs.
