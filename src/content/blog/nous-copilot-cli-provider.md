---
title: "Building a GitHub Copilot Provider for Nous"
date: "2026-06-27"
excerpt: "A 'good first issue' that became a lesson in moving targets, the CLI I built on got deprecated mid-review, so I retargeted and hardened it before it merged."
---

## The Project

[Nous](https://github.com/orthogonalhq/nous-core) (Neural Operations Unification System) is a local-first, self-hosted, open-source AI personal assistant. It composes foundation models (Anthropic, OpenAI, Ollama, and more) into a single agent that routes each task to the right model. It ships as a web app, an Electron desktop app, and a `nous` CLI, all living in one pnpm TypeScript monorepo maintained by Orthogonal.

I contributed here through CodePath's AI301 open source capstone. Nous felt like a real, layered production codebase where a contribution would actually matter.

## The Issue

Nous exposes each model backend as a certified **provider leaf**: a small, self-contained folder under `self/subcortex/providers/src/providers/<vendor>/` that describes how to talk to one provider. There was no leaf for the GitHub CLI, so someone with `gh` installed and authenticated locally could not route inference through it.

Issue [#280](https://github.com/orthogonalhq/nous-core/issues/280) asked for exactly that: a `github-copilot-cli` leaf that runs the CLI headlessly (non-interactive), hands it a rendered prompt, and returns plain text back through the standard provider pipeline, following the existing `codex-cli` leaf as the reference.

<details style="margin-top: 2em;">
<summary style="cursor: pointer; font-size: 1.4em; font-weight: 600; color: #1A1A1A;">A Closer Look: What "Headless" Means</summary>

**In one line:** headless means running a tool with no interactive interface. No prompts to answer, no menus, no session waiting on a person.

**Where the name comes from.** The "head" is the interactive or visual layer, the part a person looks at and types into. Take it away and the tool still runs, driven by input and output instead of a human. The same idea shows up in a **headless browser** (a real browser with no window, used by test scripts) and a **headless server** (no monitor, controlled over the network).

**Interactive vs headless:**

| Interactive | Headless |
| --- | --- |
| Opens a session and waits for you to type | Runs once, start to finish |
| Shows prompts, menus, or a chat loop | Input in, output out, then exits |
| A human is in the loop | A program is in the loop |

**In this provider.** Nous is a program, not a person, so it cannot sit and answer an interactive chat prompt. The leaf runs the CLI headlessly: it spawns the command, feeds the prompt in through stdin, reads the plain text back from stdout, and the process exits.

```text
Nous provider
  -> spawn `gh models run openai/gpt-4o-mini`   (run the tool as a command)
  -> write the prompt to its stdin              (feed it the input)
  -> read plain text from its stdout            (capture the answer)
  -> process exits                              (one shot, done)
```

That is exactly why the interactive `gh copilot suggest` assistant was the wrong fit and the single-shot `gh models run` was the right one: a program can feed stdin and read stdout, but it cannot work an interactive prompt.

</details>

## The Twist: The Command I Built On Got Deprecated

I first built the leaf against the obvious surface, `gh copilot suggest --target shell`. Then a manual smoke test came back empty: the command produced no usable output.

Digging in, I found why. GitHub had announced the deprecation of the `gh-copilot` extension on 2025-09-25, and by 2025-10-25 that command stopped emitting output. Building the leaf on it would have shipped a dead command path on day one.

The supported replacement was the GitHub Models extension, `gh models run <model>`, which does non-interactive single-shot queries and writes plain text to stdout. I confirmed the invocation shape against the extension's own source before trusting it, then documented the deprecation and the pivot in the PR and retargeted the leaf onto `gh models run` with a default model of `openai/gpt-4o-mini`.

The retarget changed the runtime meaning of the provider (a general text model instead of a shell-command assistant), but it kept the leaf on a command path the project can actually support going forward. That trade was the whole point.

## Making It Safe to Spawn a Process

The provider spawns a child process, and most of the remaining work came out of two review rounds with the maintainer, [@atlamors](https://github.com/atlamors). Almost all of it was about doing that spawning safely:

- **Prompt over stdin, not argv.** Passing the prompt as a command-line argument leaks its contents into process listings and any argv-based logging. I moved the prompt to the child's stdin so it never appears in the process line.
- **An explicit environment policy.** Instead of handing the child my entire environment (which can quietly leak secrets), the runner honors a shared `environmentPolicy` with three modes: `none`, `allowlist`, or `explicit`.
- **Timeout escalation.** A child that ignores `SIGTERM` could hang the whole lane, so a timed-out process is escalated to `SIGKILL` after a short grace period. A run always settles instead of hanging forever.
- **Keeping the runtime schema strict.** I had loosened a global schema to make the leaf easier to author. The maintainer pushed back, so I reverted that and hydrated the derived provider id inside the leaf's test instead, which keeps the runtime contract strict for everyone else.
- **Small but real edge cases.** I guarded the child's stdin against `EPIPE` on early exit, and scoped process abort to before-start only, with a documented caveat that matches the `codex-cli` reference.

None of this changed what the provider does. It changed how carefully it does it, which is exactly what "certified" is supposed to mean.

## The PR

[PR #396](https://github.com/orthogonalhq/nous-core/pull/396) landed as 14 commits, +1015 / -7 across 15 files: the four-file leaf (`definition.ts`, `adapter.ts`, `provider.ts`, `index.ts`), plus regenerated provider catalogs and updated snapshot and roster tests. The full package suite stayed green, including the codegen and type checks.

After a third review, @atlamors approved and merged it (merge commit `739d565`) as an early-access CLI provider leaf, which auto-closed issue #280 as completed. It is my second merged contribution to a real open source project.

## What I Took Away

- **Check that an external surface is current and supported before building on it.** A quick smoke test up front would have saved a mid-review retarget. Deprecations are a real part of the terrain, not an edge case.
- **Process safety is table stakes, not a follow-up.** Delivering input over stdin, applying an environment policy, and escalating timeouts are things to reach for in the first draft when you spawn a process!
- **Don't loosen a global contract to make one case easier.** Keeping the schema strict and adjusting the test was the right call. A shortcut in shared code is everyone's problem later
