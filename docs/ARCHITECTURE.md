# Architecture

## Current shape

The first `auth-flow-lab` slice is a client-only React + TypeScript + Vite application.

```text
PRODUCT / DESIGN contracts
        ↓
pure PKCE scenario model
        ↓
React semantic learning components
        ↓
Tailwind infrastructure + specialist stage CSS
        ↓
browser DOM / CSS / SVG
```

There is no backend, database, identity provider, analytics endpoint, or runtime configuration dependency.

## State boundary

Scenario state is ephemeral React state. The protocol model owns deterministic teaching facts such as step order, labels, representative request shapes, and safe/insecure outcome differences. UI state owns presentation concerns such as the current Story/Protocol view.

Do not introduce global state management, routing, a generic scenario engine, service/repository layers, or persistence for the initial single-lesson slice.

## Simulation boundary

All codes, verifiers, challenges, tokens, endpoints, and responses shown in the UI are synthetic examples. No credential or token value is accepted from the learner and no OAuth request is sent over the network.

The no-PKCE `Break it` path is intentionally simplified to teach authorization-code interception: it models an attacker obtaining the code before the legitimate client and demonstrates why sender-constraining the code exchange with PKCE changes the outcome. It is not a penetration-testing implementation.

A future change that introduces a real identity provider, credential handling, cross-origin communication, backend token exchange, external telemetry, persistence, or another trust boundary must be classified as Integration / trust (and Architecture / platform when applicable) and requires explicit product-owner approval before implementation.

## UI implementation boundary

Follow the Foundation v0.8.1 primitive-first profile:

- Tailwind CSS is styling/token infrastructure, not the visual identity.
- Use semantic HTML for ordinary controls; add an accessible primitive dependency only when a control's interaction complexity justifies it.
- Product-specific spatial stage behavior may use specialist CSS/SVG because it expresses the protocol topology directly.
- Keep the pure scenario model testable without the DOM.

## Validation

- `npm run check`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- focused Playwright interaction checks
- rendered UI capture at approximately 1440px, 390px, and 320px
