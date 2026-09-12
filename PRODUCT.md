# Product Contract

## 1. Purpose

`auth-flow-lab` makes authentication and authorization protocols understandable by turning invisible exchanges into an interactive spatial experience. The learner should be able to follow *what moves, between whom, and in what order* without translating a dense sequence diagram and a separate explanation panel in parallel.

The first supported lesson is OAuth 2.0 Authorization Code with PKCE. The current slice focuses on the **normal protected flow**: local `code_verifier` / `code_challenge` preparation, browser-mediated authorization, Authorization Code return, Token exchange, and Protected API access.

Failure and attack comparisons remain useful future lessons, but they are deliberately deferred until the normal flow is visually clear on its own.

## 2. Users and primary jobs

Primary users are engineers and learners who have seen OAuth/OIDC terminology but do not yet have a reliable mental model of the flow.

Their primary jobs are:

- see who sends what to whom without cross-reading a separate sequence diagram and prose panel;
- distinguish local PKCE preparation, human browser interaction, network requests, redirects, and responses;
- watch one normal flow play through once, then jump directly to any communication from a compact timeline;
- leave with a spatial mental model that can later be mapped to normative specifications and real implementations.

## 3. Core behaviors

- Open directly into the current learning scene; do not require a dashboard or course catalog before learning starts.
- Use one dominant desktop protocol stage with fixed actor positions and visible message travel.
- Auto-play the normal flow once on initial load. Selecting a timeline step pauses automatic progression and makes that step the current event.
- Represent the current event with a moving packet/pulse and a concise in-stage bubble. Do not require a separate inspector to understand the current event.
- Keep completed communication as subtle directional trails so the learner retains context without turning the stage into a dense static diagram.
- Keep the bottom timeline secondary and compact. It is navigation, not the main teaching surface.
- Do not require generic Next/Previous controls, Story/Protocol/Wire mode buttons, or a PKCE ON/OFF toggle in the current slice.

## 4. Product constraints

- Browser-first, client-only for the initial product slice.
- No backend, authentication provider, persistence, analytics, telemetry, cookies, or external data transmission in the initial mock.
- Example tokens, codes, URLs, and verifier values are synthetic teaching data only.
- Japanese is the primary explanatory language; standardized protocol identifiers remain in their conventional English form.
- Keyboard navigation, visible focus, reduced-motion behavior, and text/shape reinforcement for semantic states are part of the supported experience.
- Desktop is primary and should use most of the viewport. Narrow layouts may use contained internal scrolling when required for legibility.

## 5. Non-goals

- Real OAuth/OIDC login or Microsoft Entra ID integration.
- Credential collection, production token handling, or security testing against real services.
- PKCE OFF / interception comparison in the current product slice; this is deferred rather than removed from the longer-term product direction.
- A generalized scenario-authoring engine before multiple real lessons prove the need.
- Accounts, progress sync, badges, XP, leaderboards, or other gamification unrelated to protocol understanding.
- Certification, compliance, or a claim that the simplified simulation replaces the normative specifications.

## 6. Acceptance boundaries

A learning flow is supported only when:

- its protocol claims have been checked against authoritative specifications or primary vendor documentation;
- core state transitions have focused automated tests;
- the rendered interaction has been reviewed at approximately 1440px, 390px, and 320px widths;
- keyboard/focus and reduced-motion behavior have been checked for affected interactions;
- visual simplification does not imply false network boundaries, for example by presenting human interaction as direct server-to-human network traffic.

## 7. Evolution rules

- Do not silently change this contract while implementing a feature.
- Real authentication, external services, persistence, public identity, or recurring-cost platform changes require an explicit product-owner decision before implementation.
- Add abstractions only after a current lesson or repeated implementation pattern demonstrates the need.
