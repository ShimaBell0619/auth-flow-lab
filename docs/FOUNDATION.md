# Foundation provenance

- Adopted Foundation version: 0.9.1
- Copied-rule/template commit: `dc4ff0055a71c58dc43c33bcce87514d1cd79bbc`
- Reusable workflow commit: `dc4ff0055a71c58dc43c33bcce87514d1cd79bbc`
- Adopted on: 2026-09-12
- App-specific deviations:
  - none for the React + TypeScript + Vite + npm baseline;
  - the initial mock uses semantic native buttons rather than importing a primitive library because no dialog/menu/form interaction currently requires one;
  - specialist CSS/SVG is used for the protocol-stage visualization as allowed by the primitive-first profile.

## Adopted guidance

The repository derives its working rules from Foundation v0.9.1, including:

- `AGENTS.md` read order, context routing, issue-driven development, approval boundaries, mandatory self-review, and independent-review policy;
- `docs/ai-implementation.md` for Chat-based implementation;
- `docs/ui-implementation.md` for primitive-first UI layering;
- `docs/ui-review.md` for rendered review;
- `docs/adoption.md` for consumer provenance and reusable CI;
- `docs/vercel.md` and `docs/vercel-fixed-staging.md` for the staging-only hosted-review model and provider-side adoption gate.

## Hosting and deployment

- Hosting follows the Foundation v0.9.1 `docs/vercel.md` profile.
- Repository intent is source-controlled in `vercel.json`: automatic Git deployment is disabled by default and enabled only for `main` and `staging`.
- `main` is the Production branch.
- `staging` is the single mutable Fixed Staging hosted-review slot. It points directly at an explicitly selected same-repository PR HEAD and is not release or integration history.
- Normal PR review uses GitHub Actions quality evidence and rendered UI-review artifacts. A hosted browser surface is requested explicitly through the Fixed Staging workflow only when needed.
- The Fixed Staging request is read-only; the write-enabled publisher runs from trusted `main`, validates the selected PR, and uses compare-and-swap ref movement/cleanup from the adopted Foundation template.
- GitHub Actions does not maintain a parallel GitHub Pages or custom Vercel deployment workflow.

### Provider-side adoption status

Repository bootstrap is complete, but the Vercel provider-side adoption gate is **not yet complete**.

Observed evidence after the v0.9.0 repository policy was already present on `main`:

- main/bootstrap SHA: `b2967d4056ad1fa76c62dba67702133ae90c11ea`;
- disposable ordinary feature-branch smoke SHA: `b53a52d28445c97352efb87efbe9bce4a8dfa972`;
- result: Vercel still created a successful deployment for that ordinary feature branch.

Therefore the presence of `vercel.json` alone is not treated as proof that the project follows the intended staging-only model. Before this hosting profile is considered fully adopted:

1. Inspect Vercel Project Settings -> Environments and confirm Production Branch Tracking resolves `main` to Production.
2. Inspect/enable Preview Branch Tracking so the project can honor repository branch-deployment eligibility, then verify behavior rather than relying on the setting name alone.
3. Configure the stable Vercel Branch Domain/custom domain for branch `staging` and set the GitHub repository variable `FIXED_STAGING_URL` to that exact origin.
4. Run the v0.9.1 post-adoption smoke:
   - ordinary feature branch push -> no Vercel deployment/status;
   - `staging` ref movement/push -> Vercel hosted review deployment;
   - `main` -> Vercel Production deployment.

If the ordinary feature branch still deploys, the migration remains incomplete and the provider-side environment/branch-tracking configuration must be corrected before Issue #15 can close.

Copied rules do not update automatically. Foundation upgrades must be deliberate and preserve app-specific product/design decisions unless the product owner approves a change.
