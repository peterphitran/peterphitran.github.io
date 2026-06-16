---
title: "My First Merged PR — GraphQL Hive Docs"
date: "2026-06-15"
excerpt: "How I found a documentation gap in GraphQL Hive, traced the correct configuration for three different routers across the codebase, and got my first PR merged into a real production open source project."
---

## The Project

[GraphQL Hive](https://the-guild.dev/graphql/hive) is an open source schema registry and observability platform for GraphQL APIs, maintained by The Guild. It's a large, actively maintained project with a Bun + Turborepo monorepo and a Fumadocs-powered docs site deployed to Cloudflare.

I started contributing here through Codepath's A301 Open Source Capstone — I was already interested in GraphQL and Hive felt like a real project where my contributions would actually matter.

## The Issue

Issue [`graphql-hive/console#6575`](https://github.com/graphql-hive/console/issues/6575) asked for documentation on how to serve a contract schema using **Hive Router** inside `contracts.mdx`. The existing section had only a single sentence and an endpoint example — no actual Docker commands or configuration for any of the three supported routers:

```text
Point your Hive Gateway or Apollo Router instance to the supergraph of the contract schema:

https://cdn.graphql-hive.com/artifacts/v1/<target_id>/contracts/<contract_name>/supergraph
```

The task was to expand this into proper subsections with working configuration for **Hive Gateway**, **Hive Router**, and **Apollo Router**.

## Figuring Out the Correct Configuration

Each router has a different invocation pattern, and I had to read the existing docs carefully to get each one right.

**Hive Gateway** was the most straightforward — the pattern was already used elsewhere in the docs:

```bash
docker run --name hive-gateway --rm -p 4000:4000 \
  ghcr.io/graphql-hive/gateway supergraph \
  "https://cdn.graphql-hive.com/artifacts/v1/<target_id>/contracts/<contract_name>" \
  --hive-cdn-key "<hive_cdn_access_key>"
```

**Hive Router** was the one the issue specifically called out as missing. It doesn't use environment variables — it expects a `router.config.yaml` mounted into the container:

```yaml title="router.config.yaml"
supergraph:
  source: hive
  endpoint: https://cdn.graphql-hive.com/artifacts/v1/<target_id>/contracts/<contract_name>
  key: <hive_cdn_access_key>
```

```bash
docker run --name hive-router --rm -p 4000:4000 \
  -v ./router.config.yaml:/app/router.config.yaml \
  ghcr.io/graphql-hive/router:latest
```

**Apollo Router** is a separate image entirely (`ghcr.io/graphql-hive/apollo-router`) and does use env vars — the opposite approach from Hive Router:

```bash
docker run --name apollo-router -p 4000:4000 --rm \
  --env HIVE_CDN_ENDPOINT="https://cdn.graphql-hive.com/artifacts/v1/<target_id>/contracts/<contract_name>" \
  --env HIVE_CDN_KEY="<hive_cdn_access_key>" \
  ghcr.io/graphql-hive/apollo-router
```

One detail I had to get right across all three: the endpoint uses the **base artifact URL** (`…/contracts/<contract_name>`) without a `/supergraph` suffix, even though the example endpoint at the top of the section shows the full `/supergraph` path. Wrong suffix = broken supergraph fetch at runtime.

## Validation Without a Dev Server

The docs site is heavy — Mermaid diagrams are rendered at build time via Playwright Chromium, and the dev server on a Windows filesystem (`/mnt/c`) can take minutes to cold start. Running a full `bun dev` to check one MDX change wasn't practical.

To work around this I built `tools/preview-mdx.mjs` — a script that renders a single `.mdx` file to standalone HTML without booting the full dev server. I used that to verify the section rendered correctly — prose, anchors, no MDX errors — before opening the PR.

## The PR

PR [#129](https://github.com/graphql-hive/docs/pull/129) — `+48 / -1` to `contracts.mdx`. It was approved by `@n1ru4l` and merged by `@dotansimha` into `graphql-hive/docs:main`, which auto-closed the originating issue.

The change is live in the Hive documentation.

## What I Took Away

- **Read the existing docs before writing new ones.** Each router already had its own docs page explaining the correct config — understanding those first made the implementation straightforward.
- **The details matter.** Hive Router and Apollo Router look superficially similar but have completely different invocation patterns and even different image names. Getting one wrong would silently break users at runtime.
- **Build the tools you need.** The dev server was too slow to use for iterating on a single MDX file, so I wrote `preview-mdx.mjs` to render it in isolation. Sometimes the right move is to make the feedback loop faster before doing the actual work.
