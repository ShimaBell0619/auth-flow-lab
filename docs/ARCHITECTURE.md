# Architecture

## Current shape

The first `auth-flow-lab` slice is a client-only React + TypeScript + Vite application.

```text
PRODUCT / DESIGN contracts
        ↓
pure PKCE lesson model
(normal flow + small verifier evaluator)
        ↓
React semantic stage components
        ↓
Tailwind infrastructure + specialist stage CSS/SVG
        ↓
browser DOM / CSS / SVG
```

There is no backend, database, identity provider, analytics endpoint, or runtime configuration dependency.

## State boundary

The pure scenario model owns deterministic teaching facts such as actor identities, event order, event kind, concise packet labels, synthetic PKCE teaching values, browser-orientation examples, and verifier-evaluation outcomes.

React UI state owns presentation/interaction concerns: current event index, playback state/rate, replay state, whether the optional verifier experiment is active, the selected synthetic verifier candidate, and whether that candidate has been verified. Actor coordinates, system-boundary geometry, route curvature, packet motion, and bubble placement remain presentation geometry rather than protocol-domain state.

Do not introduce global state management, routing, a generic scenario engine, service/repository layers, or persistence for this single-lesson slice.

## Simulation boundary

All codes, verifiers, challenges, tokens, endpoints, responses, and error examples shown in the UI are synthetic teaching examples. No credential or token value is accepted from the learner and no OAuth request is sent over the network.

The default experience remains the normal Authorization Code + PKCE flow. After that flow completes, the learner may run one local verifier-mismatch experiment around Token exchange. The experiment changes only the synthetic verifier candidate and evaluates whether the challenge derived from that candidate matches the challenge already associated with the synthetic Authorization Code.

For the S256 teaching path, a matching candidate represents normal continuation. A mismatched candidate represents the RFC 7636 verification failure and produces the synthetic `invalid_grant` outcome without Access Token issuance. The application does not need to execute real SHA-256/Base64url computation for this deterministic teaching example; the pure model owns the corresponding synthetic derived values and comparison result.

The experiment is not a hidden attack branch. Do not add a no-PKCE flow, attacker actor, intercepted-Code state, credential theft, exploit behavior, external request, or parallel unsafe scenario solely to support it.

The first `User → Browser/App: サインインを開始` event is scenario context that explains why the client begins authorization. It is intentionally modeled as human interaction and must not be presented as a normative OAuth protocol message.

Human login/consent is represented separately from network traffic: User → Browser/App is an interaction event, while Browser/App ↔ Authorization represents the browser-mediated network exchange. OAuth does not prescribe the concrete user-authentication mechanism, so the visualization must remain representative rather than implying one fixed login protocol.

## Experiment state transition boundary

The normal `flowEvents` array remains the one 13-event teaching timeline and must not be duplicated for the verifier experiment.

The verifier experiment is a small adjunct state machine in the React layer:

```text
normal completion
    ↓ explicit learner action
experiment ready @ token-request
    ↓ choose synthetic verifier
candidate selected
    ↓ verify
matched ─────────→ normal token/API continuation
rejected invalid_grant ─→ stop at verifier-check
```

The pure model determines `matched` versus `rejected`; React only chooses the candidate and controls which already-defined normal-flow step is visible/reachable. Switching candidates resets the experiment to the Token Request step before another verification.

Later Token/API timeline steps must stay disabled while a candidate is unverified or rejected. This restriction belongs to presentation interaction state, not to a second scenario model.

## Visualization boundaries

The stage groups actors into pedagogical responsibility boundaries:

- `Browser / App` → `Client Device`;
- `Authorization` + `Token Endpoint` → `Authorization Server`;
- `Protected API` → `Resource Server`;
- `User` remains outside those system boundaries.

These are logical protocol/responsibility boundaries, not infrastructure inventory. A boundary does not mean a required physical VM, process, host, or service instance. The Authorization and Token endpoints are shown separately for learning while remaining responsibilities of the same logical Authorization Server.

A future change that introduces a real identity provider, credential handling, cross-origin communication, backend token exchange, external telemetry, persistence, or another trust boundary must be classified as Integration / trust (and Architecture / platform when applicable) and requires explicit product-owner approval before implementation.

## UI implementation boundary

Follow the Foundation primitive-first profile adopted by this repository:

- Tailwind CSS is styling/token infrastructure, not the visual identity.
- Use semantic HTML for compact timeline, playback, and experiment controls.
- Product-specific stage behavior may use specialist CSS/SVG because packet motion, route topology, responsibility-boundary placement, retained PKCE state, and verifier result cues express the protocol directly.
- Keep the pure lesson/evaluation model testable without the DOM.
- Respect `prefers-reduced-motion`: route meaning, current state, and verifier outcome remain visible without packet travel animation.

## Validation

- `npm run check`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- focused Playwright interaction/motion/experiment checks
- rendered UI capture at approximately 1440px, 390px, and 320px, including normal completion, mismatch rejection, correct-verifier recovery, and reduced motion
