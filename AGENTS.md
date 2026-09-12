# Auth Flow Lab — Agent Instructions

Foundation-Version: 0.9.1

## Read order

Before a material change:

1. Read the Issue / approved request and Acceptance Criteria.
2. Read `PRODUCT.md`.
3. Read this `AGENTS.md`.
4. Apply `## Context routing` and read the union of matching contracts.
5. Read `README.md` when public/user/contributor usage is affected.

`docs/FOUNDATION.md` records the adopted Foundation revision. Current product behavior belongs in `PRODUCT.md`; UI/UX decisions belong in `DESIGN.md`; substantial technical boundaries belong in `docs/ARCHITECTURE.md`.

## Context routing

| Change area / condition | Required context in addition to the base route |
| --- | --- |
| Product design / UX | `DESIGN.md` |
| UI infrastructure | `DESIGN.md`, `docs/FOUNDATION.md` |
| Integration / trust | `docs/ARCHITECTURE.md` |
| Architecture / platform | `docs/ARCHITECTURE.md` |
| Delivery / operations | `docs/FOUNDATION.md`, affected workflow/deployment contract |
| Foundation adoption | `docs/FOUNDATION.md`, target Foundation guidance/change notes |
| Local implementation / refactor | no additional contract unless another route is actually triggered |

Matching routes are additive. Do not create empty documents merely to fill a route.

## Implementation method

- Use the Foundation v0.9.1 context-routed Chat implementation method for material work: Repository Context Packet (session-local only), Design Intent, Implementation Map, coherent write batch, focused/full validation, self-review, correction, re-review, final validation.
- Issue-driven development is the default. Use a short-lived feature branch from the observed base SHA and Conventional Commit-style PR titles.
- Prefer the smallest coherent implementation. Do not add a generic scenario engine, global state library, router, backend, persistence, or abstraction solely for hypothetical future lessons.
- New product behavior, real authentication/authorization, external transmission/integration, persistence, recurring-cost services, public identity/URL changes, or material platform/deployment changes require explicit product-owner approval.
- Never implement a real attack path to make the educational `Break it` simulation more realistic. Keep attack behavior synthetic and local.

## UI rules

- `DESIGN.md` is authoritative for hierarchy and visual direction.
- Use Tailwind as styling infrastructure and semantic native controls / accessible primitives for ordinary interaction. Keep protocol-stage geometry and motion in product-specific semantic components/styles.
- User-facing UI changes require render → critique → fix → re-render.
- Review approximately 1440px desktop, 390px mobile, and 320px narrow, including overflow, Japanese wrapping, keyboard/focus, semantic status, and reduced motion.
- Do not use component-library demos, generic dashboard composition, or the ideation concept art as a page template.

## Validation and review

The default quality contract is:

- `npm run check`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Run focused E2E/rendered checks for material learning interactions. The final implementation pass is not completion: self-review the final diff against the Issue, Product contract, Design Intent, regressions, accessibility, responsive behavior, security/trust boundaries, and unnecessary complexity, then correct and revalidate.

Independent review is risk-based. The fact that the product teaches authentication does not itself make a UI-only simulation an authentication trust-boundary change. Real auth/integration, privileged workflows, destructive/data-integrity behavior, release/deployment machinery, compatibility/public-contract changes, or comparable high-risk work should receive independent review when practical. `@codex review` is never invoked without fresh explicit maintainer approval.
