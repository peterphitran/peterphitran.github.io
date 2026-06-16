# Open Source Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `/open-source` blog-style section to the portfolio where the author writes Markdown posts about their OSS journey, accessible via a new navbar tab.

**Architecture:** Astro content collection (`src/content/open-source/`) stores `.md` posts with `title`, `date`, and `excerpt` frontmatter. Two new pages handle the listing (`/open-source`) and individual posts (`/open-source/[slug]`). The existing `Header.astro` navbar gets an "Open Source" link added to both desktop and mobile menus.

**Tech Stack:** Astro 5, Tailwind CSS v4, `@tailwindcss/typography`, Bun

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/content/config.ts` | Modify | Register `open-source` collection with Zod schema |
| `src/content/open-source/` | Create dir | Holds `.md` post files |
| `src/content/open-source/getting-started.md` | Create | Sample post for dev/build verification |
| `src/pages/open-source/index.astro` | Create | Listing page — all posts sorted newest-first |
| `src/pages/open-source/[slug].astro` | Create | Individual post page with prose rendering |
| `src/components/Header.astro` | Modify | Add "Open Source" nav link (desktop + mobile) |

---

### Task 1: Register the content collection

**Files:**
- Modify: `src/content/config.ts`
- Create: `src/content/open-source/getting-started.md`

- [ ] **Step 1: Add the `open-source` collection to `src/content/config.ts`**

Replace the entire file with:

```ts
import { defineCollection, z } from 'astro:content';

const gallery = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        cover: z.string().optional(),
        photos: z.array(z.string()).default([]),
    }),
});

const openSource = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string(),
    }),
});

export const collections = { gallery, "open-source": openSource };
```

- [ ] **Step 2: Create the sample post at `src/content/open-source/getting-started.md`**

```md
---
title: "Getting Started with Open Source"
date: "2026-06-15"
excerpt: "My first steps into contributing to open source projects — what I learned, what surprised me, and what I'd tell my past self."
---

## Why Open Source?

Open source felt intimidating at first. Massive codebases, strangers reviewing your code, and the pressure of having your work be public. But diving in turned out to be one of the most valuable things I've done as a developer.

## Finding the Right Project

The best first contribution isn't always the flashiest. I started by looking for `good first issue` labels on projects I already used day-to-day. If you already understand *why* the software exists, understanding *how* it works is much easier.

## The First PR

My first PR was a documentation fix — barely 10 lines changed. But the process of forking, branching, reading contribution guidelines, writing a clear description, and responding to review feedback was the real lesson.

## What's Next

This is the start of a series where I document each meaningful contribution: the problem I found, how I approached fixing it, what the review process looked like, and what I took away.
```

- [ ] **Step 3: Verify the collection is valid by running a build**

```bash
cd c:/Users/ptran/Downloads/Projects/portfolio && bun run build
```

Expected: build completes with no TypeScript or content collection errors. The `open-source` collection should appear in `.astro/types.d.ts` after the build.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/open-source/getting-started.md
git commit -m "feat: add open-source content collection with sample post"
```

---

### Task 2: Build the listing page

**Files:**
- Create: `src/pages/open-source/index.astro`

- [ ] **Step 1: Create `src/pages/open-source/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import PageSEO from "@/components/PageSEO.astro";

const allPosts = await getCollection("open-source");
const posts = allPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
---

<BaseLayout>
    <PageSEO slot="head" title="Open Source — Peter Tran" />

    <main class="mx-auto max-w-4xl px-5 sm:px-6 py-16">
        <p class="text-xs uppercase tracking-[0.15em] text-secondary mb-2 font-medium">Writing</p>
        <h1 class="text-3xl font-medium text-primary mb-10">Open Source</h1>

        {posts.length === 0 ? (
            <p class="text-sm text-secondary">No posts yet.</p>
        ) : (
            <div class="divide-y divide-border">
                {posts.map((post) => (
                    <article class="py-7">
                        <a
                            href={`/open-source/${post.id}`}
                            class="block group"
                        >
                            <h2 class="font-medium text-lg text-primary group-hover:text-accent transition-colors duration-200 mb-1">
                                {post.data.title}
                            </h2>
                            <p class="text-xs text-secondary mb-3">
                                {formatDate(post.data.date)}
                            </p>
                            <p class="text-sm text-secondary italic leading-relaxed">
                                {post.data.excerpt}
                            </p>
                        </a>
                    </article>
                ))}
            </div>
        )}
    </main>
</BaseLayout>
```

- [ ] **Step 2: Start the dev server and visit `/open-source`**

```bash
cd c:/Users/ptran/Downloads/Projects/portfolio && bun dev
```

Open `http://localhost:4321/open-source` in a browser. Expected: page renders with the "Writing" label, "Open Source" heading, and the sample post entry showing title, formatted date, and excerpt.

- [ ] **Step 3: Verify the build still passes**

```bash
bun run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/open-source/index.astro
git commit -m "feat: add open source listing page"
```

---

### Task 3: Build the individual post page

**Files:**
- Create: `src/pages/open-source/[slug].astro`

- [ ] **Step 1: Create `src/pages/open-source/[slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import PageSEO from "@/components/PageSEO.astro";

export async function getStaticPaths() {
    const posts = await getCollection("open-source");
    return posts.map((post) => ({
        params: { slug: post.id },
        props: { post },
    }));
}

const { post } = Astro.props;
const { Content } = await render(post);

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
---

<BaseLayout>
    <PageSEO slot="head" title={`${post.data.title} — Peter Tran`} />

    <main class="mx-auto max-w-4xl px-5 sm:px-6 py-16">
        <a
            href="/open-source"
            class="text-xs text-secondary hover:text-primary transition-colors duration-200 mb-8 inline-block"
        >
            ← Open Source
        </a>

        <h1 class="text-3xl font-medium text-primary mb-2">{post.data.title}</h1>
        <p class="text-xs text-secondary mb-10">{formatDate(post.data.date)}</p>

        <article class="prose prose-sm max-w-none font-sans">
            <Content />
        </article>
    </main>
</BaseLayout>

<style>
    .prose {
        --tw-prose-body: #1A1A1A;
        --tw-prose-headings: #1A1A1A;
        --tw-prose-lead: #8A8A8A;
        --tw-prose-links: #4A7C59;
        --tw-prose-bold: #1A1A1A;
        --tw-prose-counters: #8A8A8A;
        --tw-prose-bullets: #8A8A8A;
        --tw-prose-hr: #E8E3DA;
        --tw-prose-quotes: #1A1A1A;
        --tw-prose-quote-borders: rgba(74, 124, 89, 0.3);
        --tw-prose-captions: #8A8A8A;
        --tw-prose-code: #1A1A1A;
        --tw-prose-pre-code: #1A1A1A;
        --tw-prose-pre-bg: #F5F5F5;
        --tw-prose-th-borders: #E8E3DA;
        --tw-prose-td-borders: #E8E3DA;
    }
</style>
```

- [ ] **Step 2: Start the dev server and visit the sample post**

```bash
bun dev
```

Open `http://localhost:4321/open-source/getting-started`. Expected: post page renders with the back link, title, date, and formatted Markdown prose. Check that headings, body text, and any code blocks use the correct colors from the design system.

- [ ] **Step 3: Verify the build produces the static page**

```bash
bun run build
```

Expected: build succeeds and `dist/open-source/getting-started/index.html` is generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/open-source/[slug].astro
git commit -m "feat: add individual open source post page"
```

---

### Task 4: Add "Open Source" to the navbar

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Add the desktop nav link**

In `src/components/Header.astro`, find the desktop `<menu>` block. It currently reads:

```astro
<li>
    <a href="/gallery" class="hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline">Gallery</a>
</li>
<!-- More dropdown -->
```

Replace it with:

```astro
<li>
    <a href="/gallery" class="hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline">Gallery</a>
</li>
<li>
    <a href="/open-source" class="hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline">Open Source</a>
</li>
<!-- More dropdown -->
```

- [ ] **Step 2: Add the mobile nav link**

In the same file, find the mobile `<menu>` block. It currently reads:

```astro
<li><a href="/gallery" class="hover:text-primary transition-colors duration-200">Gallery</a></li>
<li class="pt-2 border-t border-border text-xs uppercase tracking-widest text-secondary/60">More</li>
```

Replace it with:

```astro
<li><a href="/gallery" class="hover:text-primary transition-colors duration-200">Gallery</a></li>
<li><a href="/open-source" class="hover:text-primary transition-colors duration-200">Open Source</a></li>
<li class="pt-2 border-t border-border text-xs uppercase tracking-widest text-secondary/60">More</li>
```

- [ ] **Step 3: Verify in the browser**

```bash
bun dev
```

Open `http://localhost:4321`. Expected: "Open Source" appears in the desktop nav between Gallery and More. Resize to mobile (< 640px) and open the hamburger menu — "Open Source" should appear between Gallery and the "More" divider. Click the link to confirm it routes to `/open-source`.

- [ ] **Step 4: Verify the build**

```bash
bun run build
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Open Source link to navbar"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run a full production preview**

```bash
bun run build && bun run preview
```

Open `http://localhost:4321` in the browser. Walk through:
1. Navbar shows "Open Source" on desktop and mobile
2. Clicking "Open Source" loads `/open-source` with the post listing
3. Clicking the sample post title loads `/open-source/getting-started`
4. The back link `← Open Source` on the post page returns to the listing
5. Prose styling (headings, body, blockquotes, code) matches the portfolio's color palette

- [ ] **Step 2: Commit any final tweaks, then update `CONTEXT.md`**

Open `portfolio/CONTEXT.md`. Update §2 Current goal and append to §5 Scratchpad:

```
- 2026-06-15: Implemented open source blog section. New Astro content collection at
  src/content/open-source/, listing page at /open-source, post page at /open-source/[slug].
  Navbar updated (desktop + mobile). Sample post at getting-started.md for reference.
```
