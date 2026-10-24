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
- No test suite configured. Browser checks: `wsl bash /mnt/c/Users/ptran/Downloads/Projects/portfolio/.superpowers/verify/run-verify.sh` from **PowerShell** (Git Bash mangles `/mnt/c`); Playwright lives in WSL `~/portfolio-verify`. Note: `.superpowers/` is gitignored, so these scripts exist only on this machine, not in the repo. The script uses port 4399 because other projects (e.g. `website/`) run `astro preview` on 4321, and Astro silently picks another port when 4321 is busy.

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
- 2026-10-23: Started brainstorm #2: redesign interior pages (projects, gallery, blog, topics). Current: per-page painting as dimmed fixed background + big title + list; seam on long pages; gallery empty. Round 1 (page frame): current / landing-style placard hero / painting pinned beside content / header band. Companion session `848-1792768871`, port 52276. User chose A (landing-style placard hero) but wants a different content-area background; showing solid / blurred painting continuation / warm paper / grain / deepening gradient. Clarified: keep layout A, but replace the four unrelated hero paintings with one unified idea; showing Matterhorn close-ups / blurred washes / flat palette colors / topographic lines. Shortlist: 2 (blurred washes) + 4 (topo lines). Round 2: layered ridgelines / halftone Matterhorn / night sky stars / elevation profile line. Shortlist: 2 (blurred washes) + 4 (topo lines). Round 2: layered ridgelines / halftone Matterhorn / night sky stars / elevation profile line. Companion restarted: session `922-1792771259`, port 60898. Round 2 rejected. Researched Awwwards/Dribbble/Siteinspire via Playwright screenshots (text fetch saw nothing; Dribbble blocked). Round 3: duotone paintings / mountain mist / small framed print / image chip inside title. Shortlist now 2 / 4 / 10 (mist). Round 4 (deeper research): aurora ribbon / arched window / alpenglow / floating island. Shortlist now 2 / 4 / 10 (mist). Round 4 (deeper research): aurora ribbon / arched window / alpenglow / floating island. Companion idles out after 30 min (hardcoded); now session `960-1792773516`, port 63401. User liked 15 (alpenglow); shortlist 2/4/10/15. Round 5 (Dribbble ink/riso/paper/sunset, Godly, Minimal Gallery, Awwwards illustration): ink-wash mountains / single ring / engraved plate / image + color block. User liked 19 (engraving); shortlist 2/4/10/15/19. Round 6 (no existing images; Awwwards WebGL, Codrops, Dribbble generative/light rays): fireflies / sunrise rays / words as texture / pillar mountain. Round 6 rejected. Showing shortlist recap: 2 washes / 4 contours / 10 mist / 15 alpenglow / 19 engraving.
- 2026-10-23: User chose 10 (mountain mist). Implemented locally, UNCOMMITTED, on branch `feat/interior-mist` (off feat/landing-redesign): PageHero renders a mist gradient (#e3e9e2 -> teal at 82%) + 2 drifting blurred fog bands per page (`mist` index 0-3 via Base hero options); SiteNav colors now CSS vars (`--nav-ink`, `--nav-ink-soft`, `--nav-line`, `--nav-hover`, `--nav-accent`, `--nav-focus`) so PageHero can set dark ink on the pale sky; phone menu dialog resets `--nav-focus`; removed PageBackground.astro + per-page painting props; interior theme-color #e3e9e2. Gotcha: `src/pages/gallery.astro` has mixed CRLF/LF line endings, edit byte-preserving. Preview running on :4399 for review.
- 2026-10-23: User disliked mist on the real site; switched to 2 (soft color washes), still UNCOMMITTED on `feat/interior-mist`. PageHero now uses a getImage() 960w webp of the Matterhorn as a CSS background, zoomed 320%, blur(60px), different area per page (`wash` index 0-3: summit / forest / sunlit sky / snowy face), plus a ::before with top shade, corner shade and fade to page teal. SiteNav color-var change reverted (cream nav works on washes). Gotcha: list the fade-to-teal gradient FIRST in the ::before so it paints on top; otherwise the corner shade darkens the hero bottom and leaves a hard seam. Preview on :4399.
- 2026-10-23: Nav unified: every page uses the landing's centered small-caps nav (no wordmark, no hairline); interior pages prepend a "home" tab. SiteNav `variant` prop replaced by `showHome` (default true; landing passes false). Phones: "menu" alone at right; menu list includes home on interior pages. Verify script updated (home tab checks) and the "aria-expanded resets" check now waits: repro showed the dialog close event lands after the click returns (~50% read "true" immediately, always "false" by 100ms), so it was a test race, not a site bug. 27/27 pass. Still uncommitted on `feat/interior-mist`.
- 2026-10-23: Landing: added a third line under the summary (current interests: inference engineering, RL, mechinterp, security of multimodal intelligent systems, translational bioinformatics). Reuses `.hero__summary`; `.hero__summary + .hero__summary` adds 0.75rem spacing. 27/27 checks pass. Uncommitted on `feat/interior-mist`.
- 2026-10-23: Landing title line changed to "Computer Science & Mathematics, UT Arlington" (was "Software engineer & CS researcher, UT Arlington"). Meta/OG descriptions unchanged. Uncommitted on `feat/interior-mist`.
