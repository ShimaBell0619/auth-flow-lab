# Foundation provenance

- Adopted Foundation version: 0.9.0
- Copied-rule/template commit: `f49c2b93f83771be2b5437f379e41e92d70eb323`
- Reusable workflow commit: `f49c2b93f83771be2b5437f379e41e92d70eb323`
- Adopted on: 2026-09-12
- App-specific deviations:
  - none for the React + TypeScript + Vite + npm baseline;
  - the initial mock uses semantic native buttons rather than importing a primitive library because no dialog/menu/form interaction currently requires one;
  - specialist CSS/SVG is used for the protocol-stage visualization as allowed by the primitive-first profile.

## Adopted guidance

The repository derives its working rules from Foundation v0.9.0, including:

- `AGENTS.md` read order, context routing, issue-driven development, approval boundaries, mandatory self-review, and independent-review policy;
- `docs/ai-implementation.md` for Chat-based implementation;
- `docs/ui-implementation.md` for primitive-first UI layering;
- `docs/ui-review.md` for rendered review;
- `docs/adoption.md` for consumer provenance and reusable CI;
- `docs/vercel.md` and `docs/vercel-fixed-staging.md` for the staging-only hosted-review model.

## Hosting and deployment

- Hosting follows the Foundation v0.9.0 `docs/vercel.md` profile.
- Vercel Git Integration deploys only `main` and `staging`; repository-owned `vercel.json` disables automatic deployment for all other branches.
- `main` is the Production branch.
- `staging` is the single mutable Fixed Staging hosted-review slot. It points directly at an explicitly selected same-repository PR HEAD and is not release or integration history.
- Normal PR review uses GitHub Actions quality evidence and rendered UI-review artifacts. A hosted browser surface is requested explicitly through the Fixed Staging workflow only when needed.
- The Fixed Staging request is read-only; the write-enabled publisher runs from trusted `main`, validates the selected PR, and uses compare-and-swap ref movement/cleanup from the adopted Foundation template.
- Vercel Branch Domain/custom-domain mapping and the GitHub repository variable `FIXED_STAGING_URL` remain provider/repository settings and must identify the stable Staging origin.
- GitHub Actions does not maintain a parallel GitHub Pages or custom Vercel deployment workflow.

Copied rules do not update automatically. Foundation upgrades must be deliberate and preserve app-specific product/design decisions unless the product owner approves a change.
