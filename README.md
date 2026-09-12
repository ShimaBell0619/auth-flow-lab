# auth-flow-lab

Authentication and authorization concepts are difficult because most of the important behavior is invisible. `auth-flow-lab` turns the message exchange into a spatial, interactive learning surface: perform a protocol action, watch what moves, then reveal the real protocol representation in the same scene.

The first mock teaches **OAuth 2.0 Authorization Code + PKCE** and lets the learner compare a protected flow with a deliberately insecure no-PKCE interception simulation.

> This repository currently contains an educational simulation only. It does not perform real authentication, collect credentials, exchange tokens, persist learner data, or send telemetry.

## Current experience

- create a synthetic `code_verifier`;
- derive/send a `code_challenge`;
- receive a synthetic Authorization Code;
- let a simulated attacker intercept the code;
- compare token exchange with PKCE enabled vs intentionally disabled;
- switch between Story and Protocol views without leaving the current scene.

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

The learning content is grounded in the normative OAuth/PKCE material, including RFC 7636 (PKCE) and RFC 9700 (OAuth 2.0 Security Best Current Practice). The UI intentionally simplifies the scenario for teaching; the specifications remain authoritative.
