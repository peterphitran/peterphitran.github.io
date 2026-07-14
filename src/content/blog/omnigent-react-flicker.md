---
title: "Solving the Wrong Problem: What a Closed PR Taught Me"
date: "2026-07-06"
excerpt: "fixing the wrong issue and understanding the results from a closed PR."
---

## The Project

[Omnigent](https://github.com/omnigent-ai/omnigent) is an open-source AI agent framework and meta-harness: one orchestration layer over many coding agents (Claude Code, Codex, Cursor, Goose, and more) so you can swap or combine harnesses without rewriting. The backend is Python; the web frontend is Vite + React.

## The Issue

Issue `#1289` said the Codex goal dialog **flickered** on every save: the objective box, the mode control, and the buttons all appeared to redraw. It read like a rendering problem, so I went looking for a rendering problem. That framing decided everything that followed.

## My Diagnosis

I tried to be disciplined, testing the subcomponents with render and mount/unmount logging to answer one question: **re-render or remount?**

The logs were clear: lots of RENDER lines on save, no MOUNT/UNMOUNT. A re-render cascade, not a remount. Following the props, I found that the save handler did `onGoalChange(response.goal)`, handing every child a **brand-new `goal` object** on each save. New identity, so `React.memo` dutifully re-rendered all of them.

## My Commit Fix

I wrapped the presentational subcomponents in `memo` and stopped passing the `goal` object into them, deriving the primitives each child needed (`showKeepCurrentMode`, `showPause`, `showResume`) with `useCallback`-stable handlers. On save, the objective box and mode control dropped from 2 re-renders to 0.

I had verified and thought it was clean, and a textbook fix for the problem I had *decided* the bug was.

## The Feedback That Reframed Everything

Two reviews landed, and both should have stopped me sooner:

- An automated review flagged a **real regression**: as part of the refactor I'd deleted a `[goal, open]` re-seed effect, which meant a save during a live `active → blocked/usageLimited` transition could silently overwrite a Codex-owned status back to `active`. I'd removed more than the bug required.
- Then the maintainer left the comment that mattered most: **"I can still see the flickering,"** with a video.

The flicker was still there. I reproduced the exact visual symptom instead of trusting my diagnosis. I had stuck with my gut and the thing the user could *see* and the thing I had *measured* were not the same thing.

## What Actually Shipped

The maintainer closed my PR **unmerged** and landed his own fix under a different issue (`#2032`). It was a fraction of the size, and it targeted a completely different root cause:

The submit button rendered its spinner as an **extra child next to the label**. That widened the button on save and shoved its neighbours: a **layout shift**. The "flicker" was geometry, not reconciliation.

His fix added a `loading` prop to the shared `Button` component that overlays a centered spinner and **hides the label in place** (`display: contents` + `invisible`), so the button keeps its exact width and gap while forcing `disabled` + `aria-busy`. The four dialog actions just pass `loading` instead of inlining a spinner:

```tsx
<Button onClick={onSave} disabled={readOnly || busy} loading={saving}>
  {hasGoal ? "Update goal" : "Set goal"}
</Button>
```

The part that stung in a useful way, one of my *early, discarded* ideas had been a "reserved spinner slot" to stop the button from resizing, which is essentially the right answer. I threw it out as "ugly extra space" because I'd already convinced myself the bug was a re-render cascade.

<details style="margin-top: 2em;">
<summary style="cursor: pointer; font-size: 1.4em; font-weight: 600; color: #1A1A1A;">What These Terms Actually Mean</summary>

The whole story hinges on a handful of React and CSS concepts. I was throwing these words around before I could have cleanly defined them, so here is what each one actually means and how it showed up in this bug.

- **Re-render.** React calls your component function again to recompute what it *should* look like (a fresh virtual-DOM tree). It's triggered when state or props change, or when a parent re-renders. The key point: a re-render is just React recomputing in memory, it does not necessarily change anything on screen. My children re-rendered on every save, but that by itself was not what the user saw.
- **Remount.** React throws the old component instance away and builds a brand-new one: it runs cleanup, discards all local state, then re-creates the element and re-runs its mount effects (and any enter animations). It is far more expensive than a re-render, and it is what makes a dialog visibly "pop" or replay its animation.
- **Reconciliation.** After a re-render produces a new tree, React diffs it against the previous tree and applies only the minimal real-DOM changes. This is why "re-rendered" and "changed on screen" are not the same thing: a component can re-render and reconcile to *zero* DOM edits.
- **`React.memo`.** A wrapper that lets a component skip re-rendering when its new props are "the same" as last time. The catch: "the same" is a **shallow** comparison, which checks objects by reference rather than by content. Hand it a new object and `memo` concludes the props changed.
- **Object identity (referential equality).** Two objects are only equal to `===` (and therefore to `memo`) when they are the *same object in memory*. `{a: 1} === {a: 1}` is `false`. Every `response.goal` was a brand-new object, so `prevGoal !== nextGoal` even when the values matched, and `memo` re-rendered anyway. Primitives (strings, booleans, numbers) compare by *value*, so passing `showPause` instead of the `goal` object finally gave `memo` something stable to trust.
- **`useCallback`.** A hook that hands back the *same* function instance across renders until its dependencies change. Without it a component builds a new function every render, and any memoized child receiving that function as a prop re-renders anyway, the same identity trap as objects. I used it to keep the click handlers stable.
- **Layout shift.** A purely visual change where an element's size or position moves its neighbours. The real bug: adding a spinner as an extra child made the button *wider*, shoving the buttons beside it. That is geometry and CSS, not React reconciliation, which is exactly why a render-focused fix never touched it.
- **`display: contents` + `invisible`.** How the shipped fix hid the label without collapsing the button. `display: contents` removes an element's own box so its children lay out as if the wrapper were not there, and Tailwind's `invisible` (`visibility: hidden`) hides the label *while keeping the space it occupies*. Together they let a centered spinner overlay sit on top while the button holds its exact width, with no shift.

</details>

<details style="margin-top: 2em;">
<summary style="cursor: pointer; font-size: 1.4em; font-weight: 600; color: #1A1A1A;">A Closer Look: React Hooks</summary>

**In one line:** a hook is a `use`-prefixed function that lets your component borrow a memory slot from React, so a value can survive from one render to the next.

### Why hooks exist

A component is just a function. It runs top to bottom on **every** render, so any plain variable inside it is created fresh and thrown away each time. A hook is how you keep a value *between* those runs. Without one, a component can never remember anything.

### How React keeps them straight: numbered slots

We can picture a row of lockers that React owns. Each `useState` call is handed the **next** locker, in the order the calls run:

```tsx
const [name, setName]   = useState("");   // call #1 -> slot 1
const [age, setAge]     = useState(0);    // call #2 -> slot 2
const [email, setEmail] = useState("");   // call #3 -> slot 3
```

- First call gets slot 1, second gets slot 2, and so on.
- React matches calls to slots **by position, not by name**.
- Every render re-runs the calls in the same order, so each one reads back its own slot.

That is the whole reason for the rule **"never call a hook inside an `if` or a loop."** Skip a call and every later slot shifts by one, so React hands back the wrong data.

### The argument is just the starting value (the "seed")

- `useState("")` starts that slot empty; `useState(0)` starts it at zero.
- The seed is used **once**, on the first render, to fill the slot.
- After that the setter drives the value and the seed is ignored, even though the `useState(...)` line runs again every render.
- You can have many `useState(0)` calls; **position** tells them apart, not the value.

### Changing state is what re-renders the UI

```text
user action -> setState(newValue) -> React updates the slot -> re-render -> UI shows the new value
```

Repeated actions just repeat that loop, each one building on the stored value. A plain variable could not do this: it would reset every render and the UI would never move.

### How long does state last?

| Scope | Held by | Survives re-render? | Survives reload? |
| --- | --- | --- | --- |
| During the session | `useState` (memory) | Yes | No |
| Beyond the session | `localStorage` / backend / URL | Yes | Yes |

State lives in memory for the life of the component. A remount, a refresh, or closing the tab empties the slot. To outlive that, you save the value somewhere external and re-seed from it on load.

That split was the whole point in this bug: the dialog's `useState` held only my in-progress **draft**, while the real goal lived on the **server**. Saving was a network request, so a mid-edit refresh would lose the draft but keep the saved goal.

### The five you will meet most

- **`useState`** stores a value and re-renders when it changes.
- **`useEffect`** runs side effects after render, with cleanup (the `[goal, open]` re-seed effect was one).
- **`useCallback`** keeps a *function's* identity stable across renders.
- **`useMemo`** keeps a *computed value* from being recalculated every render.
- **`useRef`** holds a value that survives renders **without** causing one.

</details>

## Where I Went Wrong

- **I diagnosed and didnt clearly verify the specific symptom.** I measured re-renders and fixed re-renders. The visible flicker was a button-width jump, a different problem I never put under the microscope.
- **I over-refactored.** Reaching for `memo`, derived primitives, and deleting an effect was a bigger change than the bug warranted, and it introduced a regression the minimal fix never risked.
- **I abandoned the right idea for the wrong reason.** The reserved-slot instinct was correct; I talked myself out of it.

## What I Took Away

- **Reproduce the symptom you can see before theorizing about the cause.** A render count is a proxy. The report was about something *visible*, so I should have clarified more on that requirement.
- **The smallest fix that kills the real symptom wins.** A `loading` prop on a shared button beat an architectural render refactor, and it was reusable everywhere.
- **A closed PR can still be the most useful one you write.** This one didn't merge, but it rewired how I approach "flicker," and every other symptom I can't yet reproduce.
