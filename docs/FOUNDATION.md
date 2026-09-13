# Foundation provenance

- Adopted Foundation version: 0.10.0
- Copied-rule/template commit: `007352e15fcc6f9620686d3b77e11e85341eac02`
- Reusable workflow commit: `007352e15fcc6f9620686d3b77e11e85341eac02`
- Adopted on: 2026-09-13
- App-specific deviations:
  - none for the React + TypeScript + Vite + npm baseline;
  - the initial mock uses semantic native buttons rather than importing a primitive library because no dialog/menu/form interaction currently requires one;
  - specialist CSS/SVG is used for the protocol-stage visualization as allowed by the primitive-first profile;
  - optional Fixed Staging is not adopted because this application has no stable non-Production origin requirement.

## Adopted guidance

The repository derives its working rules from Foundation v0.10.0, including:

- `AGENTS.md` read order, context routing, issue-driven development, approval boundaries, mandatory self-review, and independent-review policy;
- `docs/ai-implementation.md` for Chat-based implementation;
- `docs/ui-implementation.md` for primitive-first UI layering;
- `docs/ui-review.md` for rendered review;
- `docs/adoption.md` for consumer provenance and reusable CI;
- `docs/vercel.md` and `docs/vercel-on-demand-preview.md` for explicit hosted review.

## Hosting and deployment

- Vercel Git Integration remains the deployment owner.
- Repository intent is source-controlled in `vercel.json`: `"**": false` suppresses ordinary branches including slash-containing names, `main` is explicitly enabled for Production, and only trusted synthetic `preview/**` refs are enabled for non-Production hosted review.
- Ordinary PR review uses GitHub Actions quality evidence and rendered UI-review artifacts. Hosted review is created only after an eligible repository writer comments `/preview` on an open same-repository PR targeting `main`.
- The trusted Preview workflow resolves exact PR HEAD A, runs the pinned Foundation Web CI against A, revalidates that the PR still points to A, then publishes a synthetic child B where `parent(B)=A`, `tree(B)=tree(A)`, and `diff(A,B)` is empty.
- Vercel builds `preview/pr-N`. A Vercel `vercel.deployment.success` repository-dispatch event is accepted only after project/ref/SHA/PR/provenance checks, then the real generated `*.vercel.app` application URL is returned to the PR.
- Preview branches are removed on PR close only when the current branch retains the expected Foundation ownership marker; ref mutation and cleanup use force-with-lease semantics.
- Preview executes PR code and must not receive Production credentials or privileged Production state.
- The Vite SPA fallback rewrite remains enabled.
- GitHub Actions does not maintain a parallel GitHub Pages or custom Vercel deployment workflow.

## Fixed Staging retirement

Foundation v0.10.0 keeps Fixed Staging as an optional profile for applications that genuinely require a stable origin, such as OAuth or webhook integrations. `auth-flow-lab` has no such current requirement, so its previous `staging` request/publisher/cleanup machinery is removed rather than carried forward for compatibility.

The earlier Issue #20 requirement to configure `FIXED_STAGING_URL` is therefore superseded by this adoption. No stable `staging` origin or `FIXED_STAGING_URL` repository variable is required by the active hosting contract.

## Provider evidence and history

Foundation v0.9.2 previously proved the slash-safe deployment suppression contract in this real project: Production and `staging` deployed successfully while a disposable slash-containing ordinary branch received no Vercel deployment status. The old v0.9.0/v0.9.1 failure was caused by using `"*": false`; plain `*` did not span `/` and ordinary branches such as `feature/foo` fell through to Vercel's default deployment-enabled behavior.

Before Foundation v0.10.0 was released, `auth-flow-lab` also served as the transport PoC for On-demand Preview. It proved that moving an already-seen exact PR HEAD was insufficient to request a fresh hosted Preview in this project, while a content-identical synthetic child commit generated a new Vercel Git event. Vercel then emitted `vercel.deployment.success` containing project/ref/SHA/application-URL metadata, allowing trusted GitHub Actions to return the real Preview application URL without a Vercel API token.

The v0.10.0 consumer adoption is complete only after its post-merge provider smoke confirms all active paths on the released profile:

1. an ordinary disposable slash-containing branch receives no Vercel deployment/status;
2. an open same-repository PR accepts `/preview`, exact-source CI succeeds, Vercel builds `preview/pr-N`, and the validated real application URL is returned to the PR;
3. `main` continues to deploy successfully to Production.

Final smoke evidence is recorded in the adoption Issue/PR after the profile is present on `main`.

Copied rules do not update automatically. Foundation upgrades must be deliberate and preserve app-specific product/design decisions unless the product owner approves a change.
