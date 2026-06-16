---
title: "My First Merged PR — GraphQL Hive Docs"
date: "2026-06-15"
excerpt: "How I found a documentation gap in GraphQL Hive, traced the correct configuration across the codebase, fixed broken links, and got my first PR merged into a real production open source project."
---

## The Project

[GraphQL Hive](https://the-guild.dev/graphql/hive) is an open source schema registry and observability platform for GraphQL APIs, maintained by The Guild. It's a large, actively maintained project with a Bun + Turborepo monorepo and a Fumadocs-powered docs site deployed to Cloudflare.

I started contributing here because I was already working inside the codebase and spotted a real gap in the documentation.

## The Issue

Issue [`graphql-hive/console#6575`](https://github.com/graphql-hive/console/issues/6575) asked for documentation on how to serve a contract schema using **Hive Router** — the project's own router — inside the existing "Serving a Contract Schema" section of `contracts.mdx`. The section already covered Apollo Router and Hive Gateway, but Hive Router was missing.

When I opened `contracts.mdx`, there was already an uncommitted draft waiting in the working copy with a `### Hive Router` block added. At first glance, that seemed like the work was already done.

It wasn't.

## The Problem With the Draft

The draft had copied the Apollo Router pattern — using `--env HIVE_CDN_ENDPOINT` and `HIVE_CDN_KEY` environment variables and the `ghcr.io/graphql-hive/router` image. The problem: **Hive Router doesn't use those env vars**. Apollo Router does. This was a direct copy-paste from the wrong section.

To find the correct configuration I had to cross-reference two other pages in the docs: `router/supergraph.mdx` and `router/getting-started.mdx`. The real pattern uses a `router.config.yaml` file with `supergraph.source: hive`, an `endpoint` (the base artifact URL — no `/supergraph` suffix), and a `key`, started via:

```bash
docker run ... \
  -v ./router.config.yaml:/app/router.config.yaml \
  ghcr.io/graphql-hive/router:latest
```

I also had to verify the endpoint format. Hive Router, Hive Gateway, and Apollo Router all use slightly different URL conventions — wrong suffix = broken supergraph fetch at runtime.

## Broken Links

After fixing the config, I noticed the "For more information" links at the bottom of the block were also wrong. They used absolute paths without the `/docs/` prefix, which the site's `remark-relative-links.ts` plugin doesn't rewrite — meaning they'd 404 in production.

The correct links:
- Hive Gateway → `/docs/gateway/supergraph-proxy-source` (not `/gateway/supergraph`, which doesn't exist)
- Hive Router → `/docs/router/supergraph`
- Apollo Router → `/docs/other-integrations/apollo-router`

I cross-checked every link against the actual content files before committing.

## Validation Without a Dev Server

One challenge with this codebase: the docs site is heavy. Mermaid diagrams are rendered at build time via Playwright Chromium, and the dev server on a Windows filesystem (`/mnt/c`) takes minutes to cold start. Running a full `bun dev` to check one MDX page wasn't practical.

The repo had a `tools/preview-mdx.mjs` script that renders a single `.mdx` file to standalone HTML without booting the full dev server. I used that to verify the section rendered correctly — prose, anchors, no MDX errors — before opening the PR.

## The PR

PR [#129](https://github.com/graphql-hive/docs/pull/129) — `+48 / -1` to `contracts.mdx`. It was approved by `@n1ru4l` and merged by `@dotansimha` into `graphql-hive/docs:main`, which auto-closed the originating issue.

The change is live in the Hive documentation.

## What I Took Away

- **Read the whole section before touching it.** The existing draft looked complete but had a fundamental error. Auditing the surrounding context saved me from shipping something wrong.
- **Cross-reference multiple sources.** The correct Hive Router config only made sense after reading three separate docs pages together.
- **Links rot silently.** A path that looks right can 404 due to how the site's link rewriting works. Always verify against the actual file tree.
- **Use the tools the project already has.** `preview-mdx.mjs` already existed — I just had to find it. Reading the repo before writing code is never wasted time.
