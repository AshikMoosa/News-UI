# ADR 0002: Adopt the "Classic Newspaper" design system

## Status

Accepted

## Context

ADR 0001 established the design-system architecture but not its visual
identity — the initial tokens and `news-button` styling were generic
placeholders. A Figma-exported reference implementation (`Classic Newspaper
UI Design`, a Vite + React + Tailwind component-library spec) defines a
complete, opinionated editorial visual language: colors, type, spacing, and
component states for buttons, inputs, badges, cards, and more.

That reference is a component _spec_ to learn from, not code to copy: it's
React + Tailwind + TypeScript, none of which this repo uses (see
[[project_no_typescript]]). The task was to extract its design language —
palette, typography, spacing rhythm, border/shadow treatment — into our own
DTCG token source, then re-express it as plain-JS Lit component styles.

## Decision

Adopt the newspaper identity as the system's visual language, encoded
entirely in `@news-ui/tokens`:

| Aspect    | Choice                                                                                                                                                                                                                                                                                                                       | Rationale                                                                                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Color     | Warm cream background (`#F6F1E9`), near-black ink (`#16100A`) for text/borders, single masthead-red accent (`#9E1B1B`). No numbered gray ramp — every role is a named semantic token (`color.surface.card`, `color.text.muted`, ...).                                                                                        | The reference system has no arbitrary color scale; every hue has one job. Named tokens document that intent directly instead of relying on convention (e.g. "700 means dark-ish").                           |
| Type      | Three families, one job each: `font.family.display` (Playfair Display, headlines), `font.family.body` (Source Serif 4, long-form copy), `font.family.mono` (Space Mono, uppercase UI chrome — buttons, labels, bylines). A separate `font.label-size.*` scale for chrome text, distinct from `font.size.*` for reading text. | Editorial systems separate "what you read" from "what you operate" typographically. Reusing one scale for both would blur that distinction and produce awkward in-between sizes.                             |
| Shape     | `radius.none` (0) is the default everywhere. `radius.full` reserved for pills/circles.                                                                                                                                                                                                                                       | The reference design is uniformly flat/square — rounded corners would break the "printed page" read.                                                                                                         |
| Structure | Hairline (`border.width.hairline`, 1px) and thick (`border.width.thick`, 3px) rule tokens do the work box-shadows do elsewhere. No shadow token is used by default.                                                                                                                                                          | Newsprint doesn't have drop shadows; rules (borders) are the native way this design language separates content.                                                                                              |
| Units     | All new token values are `rem`/`em`, not `px`.                                                                                                                                                                                                                                                                               | Scales with the user's root font size / browser zoom instead of staying fixed — an explicit project requirement, and better accessibility default than the reference's Tailwind `px`-based arbitrary values. |

`news-button` was restyled against these tokens as the first (and, for this
pass, only) component to move to the new identity: 5 variants (primary,
secondary, outline, ghost, danger) × 4 sizes (xs, sm, md, lg), matching the
reference spec's button, with the size/variant switch expressed as `:host()`
attribute selectors per component (the standard Lit pattern for
reflected-property-driven styling) rather than as component-side JS-computed
class strings.

## Consequences

- Every token file gained inline `$description` metadata (DTCG supports this
  natively); Style Dictionary emits it as a CSS comment above each custom
  property, so `tokens.css` is self-documenting without a separate docs step.
- `news-button` (and, going forward, every component built against these
  tokens) has **no hardcoded color fallbacks** — it assumes
  `@news-ui/tokens`'s CSS is loaded. This is a deliberate tightening from the
  original placeholder styling, which defended against a missing tokens
  import with hex fallbacks; that defensiveness is no longer worth the
  visual noise now that the token contract is the system's foundation, not
  an optional extra.
- The other components sketched in the reference (`Input`, `Badge`, `Select`,
  `Modal`, article-card layouts, etc.) are not built here — only `news-button`
  was in scope for this pass. Their tokens (e.g. `feedback.success`,
  `feedback.warning`) already exist for when that work happens, so this
  reskin doesn't need to be repeated.
- Dark theme (`themes/dark.json`) was extended to cover every new token path
  the light theme introduced (surface.card/raised/muted, action.danger*,
  action.primary-active), as an inverted-ink take on the same identity,
  rather than left partially defined.
