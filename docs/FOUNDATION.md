# Foundation provenance

- Adopted Foundation version: 0.9.2
- Copied-rule/template commit: `d4a1c4ba018063a187621a00ab892af275ab20af`
- Reusable workflow commit: `d4a1c4ba018063a187621a00ab892af275ab20af`
- Adopted on: 2026-09-12
- App-specific deviations:
  - none for the React + TypeScript + Vite + npm baseline;
  - the initial mock uses semantic native buttons rather than importing a primitive library because no dialog/menu/form interaction currently requires one;
  - specialist CSS/SVG is used for the protocol-stage visualization as allowed by the primitive-first profile.

## Adopted guidance

The repository derives its working rules from Foundation v0.9.2, including:

- `AGENTS.md` read order, context routing, issue-driven development, approval boundaries, mandatory self-review, and independent-review policy;
- `docs/ai-implementation.md` for Chat-based implementation;
- `docs/ui-implementation.md` for primitive-first UI layering;
- `docs/ui-review.md` for rendered review;
- `docs/adoption.md` for consumer provenance and reusable CI;
- `docs/vercel.md` and `docs/vercel-fixed-staging.md` for the staging-only hosted-review model.

## Hosting and deployment

- Hosting follows the Foundation v0.9.2 `docs/vercel.md` profile.
- Repository intent is source-controlled in `vercel.json`: `"**": false` suppresses ordinary branches including slash-containing names, while only `main` and `staging` are explicitly re-enabled.
- `main` is the Production branch.
- `staging` is the single mutable Fixed Staging hosted-review slot. It points directly at an explicitly selected same-repository PR HEAD and is not release or integration history.
- Normal PR review uses GitHub Actions quality evidence and rendered UI-review artifacts. A hosted browser surface is requested explicitly through the Fixed Staging workflow only when needed.
- The Fixed Staging request is read-only; the write-enabled publisher runs from trusted `main`, validates the selected PR, and uses compare-and-swap ref movement/cleanup from the adopted Foundation template.
- GitHub Actions does not maintain a parallel GitHub Pages or custom Vercel deployment workflow.

### Vercel adoption evidence

The earlier v0.9.0/v0.9.1 suppression failure is now understood.

Observed repository/provider evidence:

- v0.9.0 bootstrap main SHA: `b2967d4056ad1fa76c62dba67702133ae90c11ea`;
- disposable slash-containing feature smoke SHA: `b53a52d28445c97352efb87efbe9bce4a8dfa972`;
- that feature branch still received a successful Vercel deployment under the old `"*": false` policy;
- Vercel Project Preview Branch Tracking was confirmed enabled;
- Vercel Project Production Branch Tracking was confirmed as `main`.

Therefore disabled Branch Tracking was not the cause in this project. Foundation v0.9.2 corrected the repository rule to slash-safe minimatch globstar `"**": false`; plain `*` does not span `/`, so common branches such as `feature/foo` and `chore/...` previously fell through to Vercel's default deployment-enabled behavior.

After this v0.9.2 policy reaches `main`, adoption evidence must include the three-path smoke:

1. ordinary slash-containing feature branch push -> no Vercel deployment/status;
2. `staging` ref movement/push -> Vercel hosted review deployment;
3. `main` -> Vercel Production deployment.

The stable Vercel Branch Domain/custom domain for `staging` and GitHub repository variable `FIXED_STAGING_URL` remain external setup required by the full Fixed Staging workflow. The repository must not claim Issue #15 complete until any still-missing external setup is identified or completed.

Copied rules do not update automatically. Foundation upgrades must be deliberate and preserve app-specific product/design decisions unless the product owner approves a change.
