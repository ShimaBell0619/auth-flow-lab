# Architecture

## Current shape

The first `auth-flow-lab` slice is a client-only React + TypeScript + Vite application.

```text
PRODUCT / DESIGN contracts
        ↓
pure PKCE normal-flow model
        ↓
React semantic stage components
        ↓
Tailwind infrastructure + specialist stage CSS/SVG
        ↓
browser DOM / CSS / SVG
```

There is no backend, database, identity provider, analytics endpoint, or runtime configuration dependency.

## State boundary

The pure scenario model owns deterministic teaching facts such as actor identities, event order, event kind, concise packet labels, and short bubble copy.

React UI state owns presentation-only concerns: current event index, whether the one-time auto-play is still active, and reduced-motion behavior. Actor coordinates, system-boundary geometry, route curvature, packet motion, and bubble placement remain presentation geometry rather than protocol-domain state.

Do not introduce global state management, routing, a generic scenario engine, service/repository layers, or persistence for the initial single-lesson slice.

## Simulation boundary

All codes, verifiers, challenges, tokens, endpoints, and responses shown in the UI are synthetic teaching examples. No credential or token value is accepted from the learner and no OAuth request is sent over the network.

The current slice shows only the normal Authorization Code + PKCE flow. The previous no-PKCE / interception comparison is intentionally deferred by product decision; do not keep hidden attack state or parallel unsafe branches in the current implementation.

The first `User → Browser/App: サインインを開始` event is scenario context that explains why the client begins authorization. It is intentionally modeled as human interaction and must not be presented as a normative OAuth protocol message.

Human login/consent is represented separately from network traffic: User → Browser/App is an interaction event, while Browser/App ↔ Authorization represents the browser-mediated network exchange. OAuth does not prescribe the concrete user-authentication mechanism, so the visualization must remain representative rather than implying one fixed login protocol.

## Visualization boundaries

The stage groups actors into pedagogical responsibility boundaries:

- `Browser / App` → `Client Device`;
- `Authorization` + `Token Endpoint` → `Authorization Server`;
- `Protected API` → `Resource Server`;
- `User` remains outside those system boundaries.

These are logical protocol/responsibility boundaries, not infrastructure inventory. A boundary does not mean a required physical VM, process, host, or service instance. The Authorization and Token endpoints are shown separately for learning while remaining responsibilities of the same logical Authorization Server.

A future change that introduces a real identity provider, credential handling, cross-origin communication, backend token exchange, external telemetry, persistence, or another trust boundary must be classified as Integration / trust (and Architecture / platform when applicable) and requires explicit product-owner approval before implementation.

## UI implementation boundary

Follow the Foundation v0.8.1 primitive-first profile:

- Tailwind CSS is styling/token infrastructure, not the visual identity.
- Use semantic HTML for the compact timeline navigation.
- Product-specific stage behavior may use specialist CSS/SVG because packet motion, route topology, and responsibility-boundary placement express the protocol directly.
- Keep the pure flow model testable without the DOM.
- Respect `prefers-reduced-motion`: route meaning and current state remain visible without packet travel animation.

## Validation

- `npm run check`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- focused Playwright interaction/motion checks
- rendered UI capture at approximately 1440px, 390px, and 320px, including the Start and PKCE-preparation states
