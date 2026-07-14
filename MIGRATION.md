# Migration guide — warm "field notebook" redesign

Six files, one design system. Everything shares `theme.css` through
`Base.astro`, so the whole site stays coherent as you add pages.

## File map

```
src/
  styles/theme.css          ← the entire visual identity (colors, fonts, wobble)
  layouts/Base.astro        ← shared head, nav, footer — every page uses this
  pages/index.astro         ← homepage (replaces yours)
  pages/now.astro           ← NEW — what you're up to right now
  pages/gallery.astro       ← taped-photo grid (drop your photos in)
  pages/open-source.astro   ← contribution notebook (fill in the array)
  pages/topics.astro        ← notebook table of contents (fill in the array)
```

## Steps

1. **Branch first.** `git checkout -b redesign` so nothing is at risk.
2. Copy the six files into place. If you have existing `gallery.astro`,
   `open-source.astro`, or `topics.astro`, rename yours to `*.old.astro`
   temporarily so you can pull content across.
3. Delete or stop importing your old Nav/layout components on these pages —
   `Base.astro` renders the header and footer itself.
4. `bun dev` and click through all five pages.
5. Fill in the three TODO arrays: gallery photos, open-source entries,
   topics. Move real content over from your `*.old.astro` files, but
   rewrite captions/blurbs in the first-person voice — short, specific,
   lowercase-friendly.
6. Delete the old files once you're happy.

## Content checklist (the "not AI generated" half)

- [ ] Headshot alt text: change "looksmaxing photo" to "Peter Tran" or similar
- [ ] Fix every "apart of" → "a part of" in any remaining content
- [ ] Replace the OG image in `Base.astro` — it's a TODO placeholder;
      your astro.config currently points at the Rust crab
- [ ] Add one non-tech line to `/now` (book, game, volleyball goal)
- [ ] Gallery captions: handwritten voice, no "Image of..." phrasing
      (that goes in `alt`, not the caption)
- [ ] Coursework and 2021–22 certificates: gone on purpose — keep them in
      your resume PDF, link the PDF from the footer if recruiters need it

## Design rules going forward (so it stays coherent)

- **One handwritten note per section, max.** The Caveat font is the spice,
  not the meal.
- **Colors come from theme.css variables only.** If you need a new color,
  add a variable; never inline a hex in a page.
- **Wobbly borders (`--wobble`) are for cards only.** Buttons, images, and
  inputs stay straight — contrast is what makes the wobble read as
  intentional.
- **New pages:** wrap content in `<Base title="...">`, use `.page-title` +
  `.page-intro` at the top, and you're automatically on-theme.
- **Copy voice:** first person, story before stack, specifics over
  adjectives. "Onboarding went from a manual chore to under thirty
  seconds" beats "highly efficient onboarding solution" every time.

## If Tailwind fights you

These files use scoped vanilla CSS and don't need Tailwind, but Tailwind's
preflight reset can occasionally override base styles. If something looks
off, make sure `theme.css` is imported (via Base.astro) *after* any
Tailwind entry CSS in your layout chain.