# Design: Open Source Section

**Date:** 2026-06-15  
**Project:** portfolio  
**Status:** Approved

---

## Overview

A standalone `/open-source` page added to the portfolio site where the author publishes freeform Markdown posts about their open source journey — work done, problems faced, solutions found, and reflections. Accessible via a new "Open Source" tab in the existing navbar.

---

## 1. Content Architecture

### Collection
- **Type:** Astro Markdown content collection
- **Location:** `src/content/open-source/`
- **File format:** `.md` (one file per post)
- **Slug:** derived from filename (e.g. `my-first-pr.md` → `/open-source/my-first-pr`)

### Frontmatter Schema (added to `src/content/config.ts`)
```ts
const openSource = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),      // ISO date string e.g. "2025-03-10"
        excerpt: z.string(),   // manually written teaser for the index listing
    }),
});
```

### Example Post File
```md
---
title: "My First PR to VSCode"
date: "2025-03-10"
excerpt: "A short teaser that appears on the index listing."
---

Full Markdown content here...
```

---

## 2. Pages & Routing

### `src/pages/open-source/index.astro` — Listing Page
- Route: `/open-source`
- Fetches all posts via `getCollection('open-source')`, sorted newest-first by `date`
- Page header matches Gallery pattern:
  - `text-xs uppercase tracking-[0.15em] text-secondary` label: "Writing"
  - `text-3xl font-medium text-primary` heading: "Open Source"
- Each post entry (separated by `border-b border-border`):
  - Title as `<a href={/open-source/${slug}}>`: `font-medium text-primary hover:text-accent transition-colors`
  - Date: `text-xs text-secondary`
  - Excerpt: `text-sm text-secondary italic leading-relaxed`
- Layout wrapper: `mx-auto max-w-4xl px-5 sm:px-6 py-16` (matches Gallery/landing)

### `src/pages/open-source/[slug].astro` — Individual Post Page
- Route: `/open-source/[slug]`
- Uses `getStaticPaths` + `getCollection('open-source')` to generate one page per post
- Renders `<Content />` from Astro's content rendering pipeline
- Page structure:
  - Back link to `/open-source`: `text-xs text-secondary hover:text-primary`
  - Title: `text-3xl font-medium text-primary`
  - Date: `text-xs text-secondary mb-8`
  - Prose body: `<article class="prose prose-sm max-w-none ...">` with custom CSS variable overrides to match design system (see Section 3)
- Layout wrapper: `mx-auto max-w-4xl px-5 sm:px-6 py-16`

---

## 3. Prose Styling

`@tailwindcss/typography` is already installed and imported in `global.css`. The post body uses Tailwind's `prose` class with the following customizations to match the design system:

| Element | Class / Override |
|---|---|
| Body text | maps to `--color-primary` (#1A1A1A) via `prose` default |
| Muted text | `text-secondary` (#8A8A8A) |
| Links | `text-accent` (#4A7C59, forest green) |
| Code blocks | `bg-cellbg` (#F5F5F5) background, `text-primary` text |
| Blockquotes | `border-l-2 border-accent/30` (matches the bullet-list style used in Projects/Experiences) |
| Headings | `font-sans` (Raleway Variable), `text-primary` |

Applied as: `<article class="prose prose-sm max-w-none font-sans">` with scoped CSS in the component to wire the variables.

---

## 4. Navigation

### `src/components/Header.astro`
- **Desktop:** Add `<li>` with `<a href="/open-source">Open Source</a>` between the existing Gallery and More items. Same class as Gallery link: `hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline`
- **Mobile menu:** Add corresponding `<li>` entry between Gallery and the "More" section divider. Same class as other mobile links: `hover:text-primary transition-colors duration-200`

---

## 5. Files Changed / Created

| File | Action |
|---|---|
| `src/content/config.ts` | Add `openSource` collection with Zod schema |
| `src/content/open-source/` | New directory — author drops `.md` posts here |
| `src/pages/open-source/index.astro` | New — listing page |
| `src/pages/open-source/[slug].astro` | New — individual post page |
| `src/components/Header.astro` | Edit — add "Open Source" link (desktop + mobile) |

---

## 6. Out of Scope

- Search or filtering by tag
- RSS feed
- Comments
- Pagination (add later if post count grows large)
