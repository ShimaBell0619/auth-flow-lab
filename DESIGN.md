---
version: alpha
name: Auth Flow Lab
description: Interactive protocol-learning design system for spatial authentication and authorization lessons.
---

# Design System

## Overview

**Design direction:** a desktop-first animated sequence workspace where the learner can follow who sends what to whom, including return traffic, and deepen the exact same selected message from Story → Protocol → Wire.

The primary task is to understand causality across the full request/response exchange. Actor identity, message direction, current event, and response outcome dominate. Supporting explanation stays attached to the selected event instead of competing with the diagram.

The ideation concept art and the first kinetic-board mock are directional experiments only. Do not mechanically preserve either composition when they reduce protocol comprehension.

Avoid generic SaaS composition: no KPI grid, marketing hero, sidebar dashboard, repeated feature cards, or decorative glass panels without a protocol/interaction reason.

## Colors

Use semantic roles implemented as CSS variables:

- `canvas`: warm neutral lab-board background (`#f4f0e6`).
- `ink`: primary text and structural linework (`#142033`).
- `muted`: secondary explanation (`#667085`).
- `surface`: elevated teaching/readout surface (`#fffdf8`).
- `protocol`: normal request/response movement (`#315efb`).
- `challenge`: redirect/transformed PKCE proof (`#7251d4`).
- `success`: completed safe outcome (`#14795b`).
- `caution`: experiment/insecure-mode warning.
- `danger`: attacker traffic, rejection, or compromised comparison state.

Color never carries the full meaning: direction, labels, symbols, and text must reinforce safe, blocked, skipped, experiment, and compromised states.

Light appearance is the initial supported theme. Dark/system theming is deferred until the learning hierarchy is proven.

## Typography

- UI/explanation: system sans stack with Japanese-capable fallbacks; do not fetch external fonts in the initial product.
- Protocol identifiers and wire snippets: system monospace stack.
- Large display typography is used sparingly. Actor lanes and message labels, not a marketing headline, provide identity.

## Layout

Desktop is the primary learning surface for the PKCE lesson:

1. compact product/scenario header;
2. lesson title + persistent PKCE safety state;
3. dominant two-column workspace: sequence canvas + event inspector;
4. compact educational footnote.

The sequence canvas uses six fixed conceptual lanes: User, Browser/App, Authorization endpoint, Token endpoint, Protected API, and simulated Attacker. Authorization and Token are shown as separate lanes to make endpoint responsibilities legible even though they are commonly part of the same Authorization Server deployment.

At wide widths, use most of the viewport and target a `100dvh` experience. The sequence itself may scroll inside its bounded canvas when vertical space is limited; do not shrink actors, text, or arrows until they become illegible.

At narrow widths, desktop composition is not preserved at all costs. Keep the document width contained, let the sequence canvas scroll internally, and stack the inspector below it. Narrow layouts must remain functional but are secondary for this iteration.

## Sequence visualization

- Actor headers stay aligned with vertical lifelines.
- Each chronological event is a selectable row.
- Requests and responses both appear; redirects, attacker branches, rejection responses, Token responses, API requests, and API responses are not collapsed into one abstract packet.
- The selected event is strongly emphasized; completed events remain readable; future events are de-emphasized but visible so learners can preview the whole flow.
- PKCE OFF retains the same sequence shape. PKCE-only rows become explicit `SKIP` rows and the later Token/API route changes to the attacker. This supports direct visual comparison.
- Self-events such as verifier/challenge generation remain on the Browser/App lifeline and are visually distinct from network traffic.

## Components

Generic controls remain semantic HTML or reviewed accessible primitives. Product meaning belongs in semantic components/concepts such as:

- `SequenceWorkspace` — primary desktop learning surface;
- `ActorLane` — icon + role + lifeline for one protocol participant;
- `SequenceEventRow` — one chronological message or local protocol operation;
- `EventInspector` — explanation of the exact selected event;
- `ViewModeControl` — Story / Protocol / Wire depth control without changing diagram position;
- `SafetyModeControl` — PKCE-safe vs intentionally insecure comparison.

Specialist CSS/SVG is justified for lifelines, arrows, endpoint grouping, state emphasis, and responsive sequence containment. Do not rebuild standard focus, button, or keyboard behavior with bespoke interaction code.

## Icons

Actors require stable, simple line icons because role recognition is part of the learning task. Icons supplement labels; they never replace the actor name. Use one coherent stroke style and avoid decorative illustration or character art.

## Motion

Motion is functional: selection emphasis and state transitions may animate briefly, but the sequence does not need continuous decorative motion. Prefer transform/opacity and short durations. `prefers-reduced-motion: reduce` must preserve immediate state changes without travel or looping effects.

## Do's and Don'ts

### Do

- Make message direction and return traffic understandable before the learner reads explanatory prose.
- Use most of the desktop viewport for the sequence workspace.
- Keep Story, Protocol, and Wire attached to the same selected message.
- Make `/authorize` and `/token` responsibilities visually distinguishable.
- Keep insecure experiment mode persistent, explicit, and non-color-only.
- Validate Japanese wrapping, representative protocol strings, keyboard/focus, and contained overflow at 1440px, 390px, and 320px.
- Use render → critique → fix → re-render for material UI changes.

### Don't

- Do not compress the desktop learning surface into a small central card.
- Do not collapse a multi-message request/response exchange into one moving token when the missing return path changes understanding.
- Do not make the explanation panel a separate mental model from the diagram.
- Do not hide required protocol meaning behind hover-only affordances.
- Do not introduce generic dashboard decoration, character art, 3D illustration, glow, or glassmorphism without a learning reason.
- Do not present the simulated insecure outcome as a recipe for attacking a real system.
