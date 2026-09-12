# Foundation provenance

- Adopted Foundation version: 0.8.1
- Copied-rule/template commit: `9061ea222e5e6bba1197b03088c6cb2c13f7e0c4`
- Reusable workflow commit: `9061ea222e5e6bba1197b03088c6cb2c13f7e0c4`
- Adopted on: 2026-09-12
- App-specific deviations:
  - none for the React + TypeScript + Vite + npm baseline;
  - the initial mock uses semantic native buttons rather than importing a primitive library because no dialog/menu/form interaction currently requires one;
  - specialist CSS/SVG is used for the protocol-stage visualization as allowed by the primitive-first profile.

## Adopted guidance

The repository derives its working rules from Foundation v0.8.1, including:

- `AGENTS.md` read order, context routing, issue-driven development, approval boundaries, mandatory self-review, and independent-review policy;
- `docs/ai-implementation.md` for Chat-based implementation;
- `docs/ui-implementation.md` for primitive-first UI layering;
- `docs/ui-review.md` for rendered review;
- `docs/adoption.md` for consumer provenance and reusable CI.

## Hosting and deployment

- Hosting follows the Foundation `docs/vercel.md` profile.
- Vercel Git Integration owns Preview deployments for branches/PRs and Production deployment from `main`.
- GitHub Actions owns quality evidence and rendered UI review only; this repository does not maintain a parallel GitHub Pages or custom Vercel deployment workflow.
- Vercel build/environment/domain configuration remains provider-owned unless an application requirement justifies repository configuration.

Copied rules do not update automatically. Foundation upgrades must be deliberate and preserve app-specific product/design decisions unless the product owner approves a change.
