---
title: "`grep` Can't Count Tests: A False-Fabrication Bug in Polly"
date: "2026-07-15"
excerpt: "How a bad test count made an AI wrongly accuse its own agent of cheating."
---

## The Project

[Omnigent](https://github.com/omnigent-ai/omnigent) is an open-source AI agent framework. Instead of locking you into one AI coding tool, it puts a single control layer over many of them (Claude Code, Codex, Cursor, and more) so you can switch or combine them without rewriting anything. The backend is Python; the frontend is Vite + React.

**Polly** is an example tool built on top of it. It's an *orchestrator*: it doesn't write code itself. It hands a job to one of several AI agents, each from a different vendor (`claude_code`, `codex`, `cursor`, `hermes`, `opencode`, `pi`), and each works in its own copy of the codebase (a git *worktree*) so they don't collide.

Every agent gets one job: build something (IMPLEMENT), review another agent's work (REVIEW), or answer a question (EXPLORE). When an agent finishes, Polly runs the tests, linter, and type checker, asks a second agent from a *different* vendor to review the change, and writes down what happened in a small file it passes to the next session. That file is Polly's memory, and it's where this bug lived.

## The Issue

Issue [#949](https://github.com/omnigent-ai/omnigent/issues/949), "Orchestrator-side measurement error," opened with an accusation already on the record. In an earlier run, Polly had written a note in its memory file (`.polly/registry.json`) claiming the `codex` agent **reported more passing tests than actually existed** — "claimed 11/47/66; actual 5/6/7," tagged `miscount`, `over-report`, and `fabrication`. In plain terms: Polly had accused one of its own agents of making numbers up.

The issue set out to prove the cheating and proved the opposite. A recount by hand showed every `codex` number matched *exactly* — as long as you counted the way `codex` did: `pytest --collect-only`, same files, same commit. The agent was honest. The real bug was *how Polly counted*, and that mistake got written down as if the agent had done something wrong.

<details style="margin-top: 2em;">
<summary style="cursor: pointer; font-size: 1.4em; font-weight: 600; color: #1A1A1A;">A Closer Look: Why Counting `def test_` Lines Gives the Wrong Number</summary>

**In one line:** counting `def test_` lines tells you how many test *functions* someone wrote, but pytest runs test *cases*, and those two numbers are often different.

Polly measured "truth" with `grep -c 'def test_'` on a single file — that just counts test-function lines in one file. It then compared that to a number the agent got by *running* pytest across several files. That comparison is wrong two ways at once, and both make the count too low.

**Reason 1: one function can become many test cases.** pytest's *parametrization* (`@pytest.mark.parametrize`) runs the same function several times with different inputs, so one `def test_` line can become three or ten real cases. Counting `def` lines misses the extras:

```text
tests/test_registration_fee_fulfillment.py
  def test_ lines .................. 7
  one 3-way @pytest.mark.parametrize
  collected cases .................. 7 - 1 + 3 = 9   <- what pytest actually runs

tests/test_admin_background_checks.py
  def test_ lines .................. 10
  collected cases .................. 18   (8 extra from parametrization)
```

**Reason 2: it counted one file, not all of them.** The agent ran a *group* of files and reported the total; Polly counted just *one*. One file has fewer tests than the whole group, so the numbers never lined up:

| What Polly counted | What the agent reported | The truth |
| --- | --- | --- |
| `grep` on one file → 5 | pytest on 2 files → 11 | Both right. 5 + 6 = 11 |
| `grep` on one file → 7 | pytest on 4 files → 66 | Both right. 7 + 31 + 10 + 18 = 66 |
| `grep` → 10 | pytest → 18 | Both right. 10 functions, 18 cases |

Together, the `grep` count is guaranteed to run low, which makes an honest report look inflated. The last row says it all: the agent correctly reported `18 passed`, but Polly could only see `10` — so a correct number looked nearly doubled.

</details>

## The Twist: The Agent Was Innocent

The bug wasn't where the note said. The question was "is `codex` faking its test counts?" and the answer was no — Polly's own counting was broken, and it wrote that mistake down as the agent's dishonesty.

That changed what "fixing it" meant. No crash, no stack trace to chase — just a *judgment* Polly made and saved to a file that later runs would trust. Left alone, that bad note wouldn't be wrong once; it would follow the agent and make future runs trust it less.

It also changed *where* the fix goes. Polly's behavior lives in its prompts — the instructions it and its agents follow. So the fix isn't new logic. It's clearer instructions, plus a test to keep them there. In a project like this, the prompt *is* the code.

## The Fix

Saying "use `--collect-only`" wasn't enough. I wanted the wrong comparison to be hard to make again, everywhere Polly touches a count. What went in:

- **Compare the same thing on both sides: same command, same files, same commit.** A count only means something next to the command that produced it. One disputed number even went from 66 to 68 later, just because a newer commit added two tests — both were right for their own moment. So the check pins the commit, not just the files.
- **Count cases, not `def` lines.** Reconcile with `python -m pytest --collect-only -q <same files>`, never `grep -c 'def test_'`. `--collect-only` just lists the tests without running them, so it's fast and needs no database.
- **Don't call it cheating without proof.** Polly can't write `miscount`, `over-report`, or `fabrication` into its memory unless it re-ran the same count, same files, same commit, and the numbers still disagree. An accusation now needs evidence.
- **Say it everywhere, not once.** The guidance goes in Polly's prompt and the cross-review checklist (the parts that compare). All six agent configs now tell each agent to report the exact command and files it ran, and to spell out cases versus functions. The agents make their numbers easy to check; Polly stops guessing.
- **Add a test so the guidance can't quietly vanish.** A new test, `test_polly_test_count_ground_truth_guidance`, checks the key phrases still appear in Polly's prompt, the cross-review checklist, and every agent config. The downside, which the automated reviewer flagged, is that it's picky: reword the guidance and it breaks. That's the point — its whole job is to catch someone deleting or watering down the guidance.

None of this changed *what* Polly does — only what it's allowed to *conclude*. For a tool whose job is grading other agents, that's the part that matters.

## The PR

[PR #2140](https://github.com/omnigent-ai/omnigent/pull/2140) was one commit: **+64 lines, nothing deleted, across 9 files** — Polly's prompt, the cross-review checklist, all six agent configs, and one new test. It closed [#949](https://github.com/omnigent-ai/omnigent/issues/949).

Fittingly, Polly's own automated review ran on the PR and approved it, with one note that the test is picky (the tradeoff I'd chosen on purpose). hzub approved with "looks good to me!" and merged it as `6afe05f`.

## What I Took Away

- **Count the same way on both sides.** Same command, files, and commit & for pytest, cases, not `def` lines. A mismatched measurement doesn't give a small error; it gives a confident wrong one.
- **A wrong accusation is worse than a crash.** It doesn't fail loudly — it sits in memory and quietly makes the system trust an honest agent less. Don't record "this agent lied" until you've proven it.
- **In an agent project, the prompt is the code.** Instructions that control behavior deserve a test, just like any function.
- **A picky test can be the right test.** I kept one that breaks on small rewordings, because its only job is to make sure this guidance never quietly vanishes.
