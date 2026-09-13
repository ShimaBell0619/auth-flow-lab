---
version: alpha
name: Auth Flow Lab
description: Interactive protocol-learning design system for spatial authentication and authorization lessons.
---

# Design System

## Overview

**Design direction:** a desktop-first animated protocol stage where communication is learned by watching it move between stable actors inside visible responsibility boundaries.

The diagram is not a conventional stacked sequence chart. Actors stay spatially fixed, the current message travels as a visible glowing packet/pulse, completed exchanges remain as faint directional trails, and one concise speech bubble appears inside the stage for the current event.

The stage itself is the explanation. Avoid a separate inspector, dense supporting prose, or a second UI model that competes with the spatial flow.

## Colors

Use a clean white canvas and semantic accents:

- `canvas`: pure white (`#ffffff`).
- `ink`: primary text and structural linework (`#101828`).
- `muted`: secondary labels (`#667085`).
- `soft`: subtle trail/support/boundary lines (`#eaecf0`).
- `protocol`: normal network movement (`#2563eb`).
- `challenge`: PKCE preparation and verifier/challenge semantics (`#7c3aed`).
- `success`: successful Token/API return (`#15803d`).
- `failure`: verifier rejection / `invalid_grant` (`#b42318`).
- `interaction`: human/browser interaction that must not be confused with network traffic (`#475467`).

Color never carries the full meaning. Packet labels, actor labels, direction, line style, short bubble copy, and success/failure symbols reinforce the state.

Do not reintroduce the warm beige lab-board background or a dotted/grid canvas texture. The white stage should be structured by actors, responsibility boundaries, and communication routes rather than decorative background marks.

## Typography

- UI/explanation: system sans stack with Japanese-capable fallbacks; do not fetch external fonts.
- Protocol identifiers and boundary labels: system monospace stack.
- Keep copy terse. The active bubble is normally one short sentence plus an optional compact protocol identifier.

## Layout

Desktop is the primary surface:

1. compact product + lesson header;
2. one dominant protocol stage using most of the remaining viewport;
3. a minimal bottom timeline.

There is no separate inspector column. There are no Story / Protocol / Wire mode buttons, no persistent Break-it mode, and no generic Next/Previous action deck in the current slice.

The normal-flow stage uses five stable actors: User, Browser / App, Authorization, Token Endpoint, and Protected API. Authorization and Token remain distinct because their endpoint responsibilities are useful to learn separately.

Give those actors visible placement context without turning the stage into an infrastructure diagram:

- `User` remains outside the system boundaries as the human Resource Owner.
- `Browser / App` sits inside a restrained `CLIENT DEVICE` boundary.
- `Authorization` and `Token Endpoint` sit inside one `AUTHORIZATION SERVER` boundary.
- `Protected API` sits inside a `RESOURCE SERVER` boundary.
- Boundary boxes are visually secondary to packet motion and actor identity. They communicate protocol/responsibility grouping, not a required physical host count.

At narrow widths, preserve the desktop geometry inside a contained horizontal scroll surface rather than collapsing the actors into an unrelated mobile composition. The document itself must not overflow horizontally. Do not force the scroll position to follow every step; offer an explicit `現在の通信へ` action when the learner needs to recover the active route.

## Protocol-stage visualization

- The first scene is `User → Browser/App: サインインを開始`; it establishes learner intent before PKCE internals appear and is styled as human interaction, not as OAuth network traffic.
- Actor nodes use large, simple line icons with visible names and compact roles.
- Actor positions and system boundaries remain stable while the current event changes.
- The primary desktop topology is predominantly horizontal so direction changes are legible as packet travel and return traffic rather than vertical scene changes.
- The active route is clearly emphasized and ends with a visible direction marker.
- A glowing packet/pulse travels along the active route for network messages.
- Local operations such as verifier creation or verifier checking use a local loop around the relevant actor.
- Human interaction is visually distinct (for example a dotted route / hollow pulse) so it is not mistaken for a network packet.
- Completed events remain as low-contrast directional trails. Upcoming routes are not pre-drawn.
- Return traffic must be visible: login UI response, Authorization Code redirect, Access Token response, and API response all have their own event.
- A compact browser-location cue may show the learner whether the synthetic Browser/App example is at the application, Authorization Server UI, or callback. It must be labeled as a teaching example and must not imply that client application code receives the user's Authorization Server credentials.
- After the final API response, show only a compact 2–3 point recap tied to the normal flow. Do not navigate to a separate results/dashboard surface.

## Verifier mismatch experiment

The mismatch experiment is an optional post-completion extension of the normal lesson, not a second default timeline.

- Enter it from the normal-flow recap with a deliberate `verifierを変えて試す` action.
- Reuse the same actors, boundaries, Token Request route, and verifier-check location. Do not add an attacker actor or a parallel attack diagram.
- Start at Token exchange with auto-play paused. The learner chooses either the correct synthetic verifier or a deliberately mismatched synthetic verifier.
- Keep candidate selection and experiment actions compact in the footer area; do not create a modal, inspector, or full-page mode.
- On verify, compare `S256(received verifier)` with the challenge associated with the Authorization Code.
- A matching verifier uses the existing success semantics and can continue to Token issuance and API access.
- A mismatched verifier stops at Token Endpoint verification. Show a visible failure symbol plus `不一致`, `invalid_grant`, and a short statement that no Access Token is issued. Do not rely on red alone.
- While the mismatch result is active, later Token/API timeline steps must not be reachable as if the exchange succeeded.
- Switching the candidate resets the experiment to Token Request so the learner can deliberately run the comparison again.
- The experiment remains synthetic and local. Do not portray credential theft, a real intercepted Code, or any network attack.

## In-stage bubble

Only the current event gets a prominent explanation bubble.

- Keep it inside the protocol stage near the active route.
- Use approximately one short sentence / 1–2 lines.
- A compact protocol or interaction label may accompany the sentence.
- Do not put long explanatory paragraphs in the bubble.
- Do not create a separate readout panel that repeats the same event.

## Timeline

The timeline is secondary navigation at the bottom edge.

- Use small dots plus short labels.
- The first step is the scenario-level `Start` interaction, followed by `Verifier` and the rest of the protocol flow.
- The current step is clear; completed steps are visible but quiet.
- Each step is keyboard reachable and can be selected directly.
- Selecting a step pauses the initial auto-play so the learner can inspect the flow manually.
- During a verifier experiment, disable later steps that have not become valid through a successful verifier check; disabled steps remain visually secondary and semantically disabled.
- Do not make the timeline look like a large wizard/stepper component.

## Motion

Motion is functional and central to this lesson.

- Auto-play the normal flow once on first load, beginning with the user initiation scene.
- Use transform/SVG motion for the active packet rather than decorative looping effects.
- Keep travel durations long enough to perceive direction but short enough to maintain flow.
- `prefers-reduced-motion: reduce` must show the same active route, destination, bubble, progress, and verifier outcome without travel animation.
- Explicit orientation scrolling must use immediate movement rather than smooth motion when reduced motion is requested.

## Components

Product-specific semantic concepts include:

- `ProtocolStage` — dominant spatial learning surface;
- `SystemBoundary` — subtle Client Device / Authorization Server / Resource Server placement context;
- `ActorNode` — fixed icon + actor identity;
- `FlowTrail` — completed directional communication;
- `ActiveRoute` / `Packet` — current communication and its motion;
- `FlowBubble` — concise explanation attached to the current route;
- `FlowTimeline` — minimal direct navigation;
- `VerifierExperiment` — compact candidate selection, verify action, and success/failure result attached to the existing stage.

Specialist CSS/SVG is justified for route geometry, packet motion, actor placement, boundaries, trails, and responsive containment. Ordinary controls remain semantic HTML.

## Do's and Don'ts

### Do

- Make the user's initiating action understandable before PKCE internals appear.
- Make movement understandable before the learner reads text.
- Use most of the desktop viewport for the stage.
- Keep the background white and the visual hierarchy clean.
- Use system boundaries to explain placement without overpowering the packet flow.
- Use icons and stable actor positions to build spatial memory.
- Show request and response direction explicitly.
- Keep current copy short and in the diagram.
- Make verifier mismatch visually and semantically distinct from success, including a textual `invalid_grant` result.
- Validate overlaps among boundary labels, actors, routes, bubbles, Japanese wrapping, focus, contained overflow, experiment controls, and reduced motion at 1440px, 390px, and 320px.
- Use render → critique → fix → re-render for material UI changes.

### Don't

- Do not fall back to a conventional stacked sequence diagram as the main experience.
- Do not present the scenario-start interaction as a normative OAuth message.
- Do not imply that one visual boundary equals one mandatory physical machine or service instance.
- Do not add a separate inspector or long explanation panel.
- Do not add generic Next/Previous buttons for normal progression.
- Do not turn the verifier experiment into a PKCE ON/OFF or Code-interception comparison.
- Do not add an attacker actor or a real attack path.
- Do not use beige paper styling, decorative canvas grids, glass panels, gradients/glows unrelated to packet state, or generic dashboard composition.
- Do not imply that human input is direct network traffic to a server.
