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
- **Ysabeau** family via fontsource: `ysabeau` (headings), `ysabeau-office` (body), `ysabeau-sc` (nav, labels). Tokens in `theme.css` (`--font-display/body/hand/utility/caps`); the landing page does not load `theme.css` and uses `wetland-preview.css` tokens, so shared components (SiteNav, SiteFooter) hardcode the SC stack.
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
- `bun add/remove` run from **Windows** rewrites `node_modules/.bin` with Windows shims, so `bun run build` then fails in WSL (`astro: command not found`). Use `~/.bun/bin/bun node_modules/astro/astro.js build` (and `... preview`) in WSL.
- No test suite configured. Browser checks: `wsl bash /mnt/c/Users/ptran/Downloads/Projects/portfolio/.superpowers/verify/run-verify.sh` from **PowerShell** (Git Bash mangles `/mnt/c`); Playwright lives in WSL `~/portfolio-verify`.

---

## 2. Current goal / task

Polish and extend the personal portfolio site. Recently shipped the Open Source blog section — Markdown-driven posts at `/open-source` with a listing index and individual post pages, accessible via the navbar.

---

## 3. Issue Log

> Format per entry: Symptom → Root cause → Tried → Fix → Status → Alternatives.

### Phone menu links untappable on interior hero pages (2026-10-23)
- **Symptom:** with the phone menu open on /projects, /blog, /topics, /gallery, taps hit page content behind the overlay.
- **Root cause:** overlay was a `position: fixed; z-index: 30` div inside `.page-hero` (`position: relative; z-index: 1`), a stacking context; later siblings with equal z-index painted over it.
- **Tried:** nothing else; reviewer measured via `elementFromPoint` in headless Chrome.
- **Fix:** menu is a native `<dialog>` opened with `showModal()` (browser top layer, background inert). Regression check in `.superpowers/verify/verify-landing.mjs` ("menu links are tappable on ...").
- **Status:** fixed on `feat/landing-redesign` (541bc70).
- **Alternatives:** raise `.page-hero` z-index while open via `:has()`, or move the menu node to `<body>`.

---

## 4. Open items / watch list

- Gallery page is "Coming Soon" — real photo gallery not yet implemented.
- No deployment pipeline configured yet.

---

## 5. Scratchpad

- 2026-06-15: Onboarded project. Stack detected: Astro 5 + React 19 + Tailwind v4 + Bun. CONTEXT.md created.
- 2026-06-15: Implemented open source blog section. New Astro content collection at `src/content/open-source/`, listing page at `/open-source`, post page at `/open-source/[slug]`. Navbar updated (desktop + mobile). Sample post at `getting-started.md`. Fixed Astro 5 `.md` extension in `post.id` for clean URLs.
- 2026-10-22: Brainstorming landing redesign (keep full-bleed Matterhorn, restructure hero text). User liked "gallery placard" and "map legend" layouts; user rejected A+D combos (catalog card / peak annotation / wall band / side rail), wants fully different structures; user picked K (terminal session); rejected dev-metaphor variants (man page / commit history / palette / source file) as too K-related; rejected vertical name / magazine cover / letter / table of contents; rejected round 5 (viewfinder / widgets / boarding pass / facts label) as not simple; round 6 concept-free layouts not chosen. DECISION: go with A (gallery placard) minus the cream box (text directly on painting, bottom-left), name shown once, nav from M (JetBrains Mono, man-page header style). Chose name in text (nav = links only, centered mono). Corner text to be sans-serif; rejected Inter / DM Sans / Raleway / JetBrains Mono; from Satoshi / General Sans / Space Grotesk / Syne / Instrument Sans / Bricolage, user liked Satoshi; rejected minimal fonts (Switzer / Geist / Manrope / Outfit / Supreme / Jakarta) as not their style; rejected mountain-themed sans too (National Park / Jost / League Gothic / Archivo Expanded / Overpass / Josefin). Only liked font so far: Satoshi. User says size is not the issue. Character fonts (Clash Display / Tektur / Unbounded / Cabinet Grotesk / Chillax / Darker Grotesque) not picked. Now: Alpino / Michroma / Poiret One / Krona One / Big Shoulders Stencil / Tanker (display font for name+title, Satoshi body). Mockups in `.superpowers/brainstorm/` (gitignored).
- 2026-10-22 (design agent): Round 7 font mockup `design-agent-fonts.html`: Ranade, Sofia Sans Extra Condensed + Sofia Sans, Recursive (CASL axis), Quilon + Synonym, Ysabeau + Ysabeau Office, Amulya. Gotcha: Fontshare css API returns wrong/partial families when several `f[]` are combined in one URL; use one `@import` per Fontshare family.
- 2026-10-22: FONT DECISION: corner text = Ysabeau (name 700, title 500) + Ysabeau Office (body). Nav moving from JetBrains Mono to the Ysabeau family; comparing small caps (Ysabeau SC) / plain Office / italic / tracked caps with dots (`ysabeau-nav.html`).
- 2026-10-23: Nav = Ysabeau SC spaced small caps (option 1). Site-wide nav scope still open (recommended: links-only on landing, small-caps name + links on interior pages). Desktop design CONFIRMED as chosen (bottom-left corner). Mobile CHOSEN: single small-caps "menu" word top-right opening full-screen link list; open state = blurred dimmed painting (B), links not bold; links = Ysabeau SC small caps (regular, spaced). Landing design fully decided; remaining: nav scope on interior pages. Companion server restarted (new session dir `1689-1792764128`, port 53452).
- 2026-10-23: Brainstorm complete. Spec: `.superpowers/specs/2026-10-23-landing-redesign-design.md`; plan: `.superpowers/plans/2026-10-23-landing-redesign.md` (7 tasks: Ysabeau fonts + tokens, SiteNav rewrite w/ variant + phone menu, landing rebuild, drop Lora/Raleway, Playwright verify script, CONTEXT log). Gotcha found: `--font-utility` is used for blog/project list titles, so small caps get a new `--font-caps` token instead. `.superpowers/` added to .gitignore. No source code changed yet.
- 2026-10-23: Implemented on branch `feat/landing-redesign` (subagent per task + reviews): Ysabeau fonts site-wide, SiteNav `variant` prop (`links-only` on landing, "peter tran" wordmark elsewhere) + phone "menu" dialog (blurred painting, small-caps links), boxless placard landing hero, Lora/Raleway removed. 27/27 Playwright checks pass, lint clean. Not pushed; user reviews before push. Pre-existing, not addressed: footer social icons look dim; fixed page background shows a seam in full-page screenshots.
