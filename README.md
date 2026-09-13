# auth-flow-lab

Authentication and authorization concepts are difficult because most of the important behavior is invisible. `auth-flow-lab` turns protocol exchange into a spatial learning surface where messages visibly move between stable actors, prior communication remains as faint context, and responsibility boundaries show where each role belongs.

The first lesson teaches the **normal OAuth 2.0 Authorization Code + PKCE flow**. It begins with a scenario-level user action that starts sign-in, then shows verifier/challenge preparation, browser-mediated authorization, Authorization Code return, Token exchange, and Protected API access.

> This repository contains an educational simulation only. It does not perform real authentication, collect credentials, exchange real tokens, persist learner data, or send telemetry.

## Current experience

- desktop-first white protocol stage with large actor icons;
- the first scene is `User → Browser/App: サインインを開始`, followed by PKCE preparation;
- restrained placement boundaries: Browser/App inside `CLIENT DEVICE`, Authorization + Token Endpoint inside `AUTHORIZATION SERVER`, and Protected API inside `RESOURCE SERVER`;
- glowing packet/pulse movement between actors, with human interaction visually distinguished from network traffic;
- local PKCE operations visually distinguished from network exchange;
- completed communication retained as faint directional trails;
- one concise in-stage speech bubble for the current event;
- one-time auto-play on load, then direct navigation from a compact bottom timeline;
- no separate inspector, Story/Protocol/Wire switch, generic Next/Previous action deck, or PKCE ON/OFF comparison in the current slice;
- keyboard-focus and reduced-motion support, with narrow layouts keeping the wide stage inside contained scroll surfaces.

The system boundaries are teaching aids for logical roles/responsibilities. They do not prescribe a physical server count or deployment topology.

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

## Hosting

Hosting follows Web App Foundation v0.10.0's explicit **On-demand Preview** profile:

- ordinary feature/fix/PR branches → no Vercel deployment; normal review uses GitHub Actions CI and rendered UI-review artifacts;
- when hosted browser review is useful, an eligible repository writer comments `/preview` on the PR;
- the trusted workflow validates the exact PR HEAD, publishes a content-identical synthetic `preview/pr-N` source, and returns the real Vercel Preview application URL to the PR;
- `main` → Vercel Production deployment.

`vercel.json` uses slash-safe `"**": false` to suppress ordinary branches, while only `main` and trusted `preview/**` refs are explicitly enabled. The Vite SPA fallback rewrite is preserved.

This application does not require a fixed non-Production origin, so Foundation's optional Fixed Staging profile is not adopted. There is no parallel GitHub Pages or custom Vercel deployment path.

See `docs/FOUNDATION.md` for Foundation provenance, trust boundaries, and provider verification evidence.

## Contracts

- `PRODUCT.md` — supported product behavior and non-goals
- `DESIGN.md` — UI/UX direction and design system decisions
- `AGENTS.md` — implementation/review rules and context routing
- `docs/ARCHITECTURE.md` — technical and simulation boundaries
- `docs/FOUNDATION.md` — Web App Foundation provenance and hosting profile

This consumer adopts `web-app-foundation` **v0.10.0** at commit `007352e15fcc6f9620686d3b77e11e85341eac02`.

## Protocol references

The learning content is grounded in the normative OAuth/PKCE material, including RFC 7636 (PKCE), RFC 6749 (OAuth 2.0 Authorization Code), and RFC 9700 (OAuth 2.0 Security Best Current Practice). The UI intentionally simplifies the scenario for teaching; the specifications remain authoritative.
