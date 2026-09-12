# Product Contract

## 1. Purpose

`auth-flow-lab` makes authentication and authorization protocols understandable by turning invisible message exchanges into an interactive, spatial learning experience. The learner should understand *why* a mechanism exists by manipulating the flow and observing both success and failure states.

The first supported lesson is OAuth 2.0 Authorization Code with PKCE, focused on code interception and the role of `code_verifier` / `code_challenge`.

## 2. Users and primary jobs

Primary users are engineers and learners who have seen OAuth/OIDC terminology but do not yet have a reliable mental model of the flow.

Their primary jobs are:

- follow who sends what to whom without repeatedly cross-reading a sequence diagram and prose;
- switch between an intuitive explanation and protocol terminology without leaving the current scene;
- deliberately break a protection and observe what changes;
- leave with a mental model that can later be mapped to real specifications and implementations.

## 3. Core behaviors

- Open directly into the current learning scene; do not require a dashboard or course catalog before learning starts.
- Keep the main learning flow spatial and interactive. Advancing the lesson should use meaningful protocol actions rather than a generic Next-only interaction.
- Keep analogy and protocol fact distinguishable. Friendly metaphors may explain a concept, but protocol mode must expose the real term and representative wire-level shape.
- The PKCE lesson must demonstrate both a protected interception attempt and a deliberately insecure no-PKCE comparison.
- The insecure comparison is a local simulation. It must be visibly marked as intentionally unsafe and must never collect credentials or perform real token exchange.
- Resetting or switching the protection state must return the scenario to a coherent starting point.

## 4. Product constraints

- Browser-first, client-only for the initial product slice.
- No backend, authentication provider, persistence, analytics, telemetry, cookies, or external data transmission in the initial mock.
- Example tokens, codes, URLs, and verifier values are synthetic teaching data only.
- Japanese is the primary explanatory language; standardized protocol identifiers remain in their conventional English form.
- Keyboard navigation, visible focus, reduced-motion behavior, and text/shape reinforcement for semantic states are part of the supported experience.
- Desktop should keep the core lesson within a mostly single-screen stage. Narrow layouts may scroll when required for legibility and reachable controls.

## 5. Non-goals

- Real OAuth/OIDC login or Microsoft Entra ID integration.
- Credential collection, production token handling, or security testing against real services.
- A generalized scenario-authoring engine before multiple real lessons prove the need.
- Accounts, progress sync, badges, XP, leaderboards, or other gamification unrelated to protocol understanding.
- Certification, compliance, or a claim that the simplified simulation replaces the normative specifications.

## 6. Acceptance boundaries

A learning flow is supported only when:

- its protocol claims have been checked against authoritative specifications or primary vendor documentation;
- core state transitions have focused automated tests;
- the rendered interaction has been reviewed at approximately 1440px, 390px, and 320px widths;
- keyboard/focus and reduced-motion behavior have been checked for affected interactions;
- insecure teaching states are explicitly labeled and cannot be confused with recommended implementation guidance.

## 7. Evolution rules

- Do not silently change this contract while implementing a feature.
- Real authentication, external services, persistence, public identity, or recurring-cost platform changes require an explicit product-owner decision before implementation.
- Add abstractions only after a current lesson or repeated implementation pattern demonstrates the need.
