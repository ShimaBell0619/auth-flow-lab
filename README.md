# auth-flow-lab

Authentication and authorization concepts are difficult because most of the important behavior is invisible. `auth-flow-lab` turns message exchange into an interactive learning surface: select or advance one protocol event, follow who sends what to whom, then deepen that same event from Story to Protocol to representative Wire detail.

The first lesson teaches **OAuth 2.0 Authorization Code + PKCE** and compares a protected flow with a deliberately insecure no-PKCE interception simulation.

> This repository contains an educational simulation only. It does not perform real authentication, collect credentials, exchange real tokens, persist learner data, or send telemetry.

## Current experience

- desktop-first animated sequence diagram with User, Browser/App, Authorization, Token Endpoint, Protected API, and simulated Attacker lanes;
- explicit request and return messages, including redirect, token response, API response, and rejection response;
- Story / Protocol / Wire views for the same selected sequence event;
- synthetic `code_verifier` / `code_challenge` preparation and PKCE verification;
- `Break it` comparison that keeps the same diagram shape while marking PKCE-only events as skipped;
- keyboard-focus and reduced-motion support, with narrow layouts contained in their own sequence scroll surface.

## Development

Requirements: Node.js `22.22.2` (see `.node-version`) and npm.

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npm run check
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Contracts

- `PRODUCT.md` — supported product behavior and non-goals
- `DESIGN.md` — UI/UX direction and design system decisions
- `AGENTS.md` — implementation/review rules and context routing
- `docs/ARCHITECTURE.md` — technical and simulation boundaries
- `docs/FOUNDATION.md` — Web App Foundation provenance

This consumer currently adopts `web-app-foundation` **v0.8.1** at commit `9061ea222e5e6bba1197b03088c6cb2c13f7e0c4`.

## Protocol references

The learning content is grounded in the normative OAuth/PKCE material, including RFC 7636 (PKCE), RFC 6749 (OAuth 2.0 Authorization Code), and RFC 9700 (OAuth 2.0 Security Best Current Practice). The UI intentionally simplifies the scenario for teaching; the specifications remain authoritative.
