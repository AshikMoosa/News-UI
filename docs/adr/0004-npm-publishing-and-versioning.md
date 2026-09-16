# ADR 0004: npm publishing, licensing, and versioning strategy

## Status

Accepted

## Context

`@news-ui/tokens` and `@news-ui/ui` had matured enough (button + all eight
form controls) to publish as real, installable npm packages rather than
only being consumable by cloning the repo. Doing that required deciding:
what npm scope to publish under, what license to ship under, and how
version numbers would be assigned across releases — none of which had been
decided yet, since nothing had been published before this point.

## Decision

| Aspect                                          | Choice                                                                                                                                                                                            | Rationale                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm scope                                       | `@news-ui` (an npm Organization, created for this)                                                                                                                                                | Keeps the exact package names already used everywhere in the code, docs, and Storybook (`@news-ui/tokens`, `@news-ui/ui`) — no renaming, no doc churn.                                                                                                                                               |
| License                                         | MIT                                                                                                                                                                                               | The standard permissive license for open-source component libraries; no prior LICENSE existed, so this was a real gap to close before publishing, not a formality.                                                                                                                                   |
| Versioning                                      | Independent [SemVer](https://semver.org) per package, both starting at `0.1.0`                                                                                                                    | Standard npm-workspaces practice — each package's version reflects its own change history, not a repo-wide version. Starting at `0.1.0` (not `1.0.0`) signals pre-1.0/still-evolving, matching semver convention.                                                                                    |
| Release cadence                                 | Each release is a curated **pack** of components. While `0.x`, a new pack bumps the **minor** version (`0.1.0` → `0.2.0`); a fix to an already-released pack bumps the **patch** version instead. | Explicit user decision: components are built and released in batches (e.g. "button + all form controls" as pack one), not one npm release per individual component. Minor bumps signal "new pack," patch bumps signal "fix to what's already out," matching how consumers should read the changelog. |
| `@news-ui/ui`'s dependency on `@news-ui/tokens` | A real semver range (`^0.1.0`), not the workspace-local `*` used during development                                                                                                               | `*` resolves fine inside the monorepo (npm workspaces symlink it locally) but is meaningless/risky once published — external installs need an actual version constraint against the registry.                                                                                                        |
| Published file scope                            | `@news-ui/tokens` ships only `dist/` (its build output); `@news-ui/ui` ships `src/` minus `*.test.js`/`*.a11y.test.js`/`*.stories.js`/`test-setup/` (via `.npmignore`)                            | Consumers need the compiled tokens and the component source (this library ships unbundled ES modules, not a bundle), not the test suite or Storybook stories.                                                                                                                                        |
| Pre-publish safety gate                         | `prepublishOnly` scripts: tokens rebuilds `dist/` fresh; ui re-runs lint + both test suites                                                                                                       | `npm publish` should never ship a stale build or code that fails its own tests — this makes that structurally impossible rather than a manual step someone can forget.                                                                                                                               |

Both `LICENSE` files (root, and copied into each publishable package's own
directory — `npm publish` only reads files from the package's own directory
tree, not parent directories) and each package's `CHANGELOG.md` were added
as part of this decision, not as a separate follow-up.

## Consequences

- Publishing itself (npm org creation, `npm login`, `npm publish`) is a
  manual, human-run process for now — no CI/automated-release pipeline
  exists in this repo (see [ADR 0003](0003-narrow-repo-scope-to-design-system.md),
  which removed `.github/workflows` from this repo's scope). Semantic
  Release wired to Conventional Commits, as ADR 0001 originally sketched,
  remains a possible future addition, not something this decision commits
  to.
- `packages/react-wrapper` and `packages/utils` are not part of this first
  publish — neither has any code in it yet.
- Every future component pack follows this same shape: bump `@news-ui/ui`'s
  minor version, bump `@news-ui/tokens`' version too _if that pack actually
  changed the tokens_ (patch for fixes, minor for new tokens a new
  component needed), update whichever `CHANGELOG.md`(s) actually changed,
  update `@news-ui/ui`'s dependency range on `@news-ui/tokens` if it
  bumped, then publish tokens before ui (ui depends on it).
