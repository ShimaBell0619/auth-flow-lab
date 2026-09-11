---
version: alpha
name: Auth Flow Lab
description: Interactive protocol-learning design system for spatial authentication and authorization lessons.
---

# Design System

## Overview

**Design direction:** a kinetic protocol board where messages physically move between participants, so cause-and-effect dominates the first glance and technical detail can be revealed in place without turning the lesson into a dashboard.

The primary task is to understand the current message exchange. The current actors, current packet, consequence, and next meaningful action dominate. Navigation, implementation notes, and supporting protocol detail are secondary.

The concept art produced during ideation is directional inspiration only. Do not mechanically reproduce its cartoon world, panel allocation, or visual motifs.

Avoid generic SaaS composition: no KPI grid, marketing hero, sidebar dashboard, repeated feature cards, or decorative glass panels without a protocol/interaction reason.

## Colors

Use semantic roles implemented as CSS variables:

- `canvas`: warm neutral lab-board background (`#f4f0e6`).
- `ink`: primary text and structural linework (`#142033`).
- `muted`: secondary explanation (`#667085`).
- `surface`: elevated teaching/readout surface (`#fffdf8`).
- `protocol`: trusted/active protocol movement (`#315efb`).
- `challenge`: transformed proof/challenge (`#7c4dff`).
- `success`: completed safe outcome (`#14795b`).
- `caution`: experiment/insecure-mode warning (`#c86b12`).
- `danger`: successful attacker/compromised outcome (`#c73d3d`).

Color never carries the full meaning: safe, blocked, experiment, and compromised states must also have text or symbols.

Light appearance is the initial supported theme. Dark/system theming is deliberately deferred until the kinetic board has proven its hierarchy.

## Typography

- UI/explanation: system sans stack with Japanese-capable fallbacks: `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `"Noto Sans JP"`, `sans-serif`. Do not fetch external fonts in the initial mock.
- Protocol identifiers and wire snippets: `ui-monospace`, `SFMono-Regular`, `Consolas`, `"Liberation Mono"`, `monospace`.
- Large display typography is used sparingly. Protocol actors and message names, not a marketing headline, provide identity.

## Layout

Desktop composition is a stage, not a page feed:

1. compact product/scenario header;
2. horizontal scenario rail showing current learning position;
3. dominant protocol stage;
4. integrated action/readout deck attached to the stage.

At wide widths, target a `100dvh` experience with no required page-level vertical scroll for the core PKCE path. Supporting copy must not push the stage below the fold.

At narrow widths, preserve priority in this order: current action/outcome, actors and packet path, scenario rail, protocol detail. Actor geometry may become vertical and the document may scroll rather than shrinking text or controls below useful sizes.

Use container/available-space thinking rather than device-name branching.

## Elevation & Depth

The board uses linework, contrast, overlap, and a small surface hierarchy before shadow. Elevation communicates a floating packet/readout or focused control; it is not decorative polish.

The protocol stage may use subtle grid/drafting textures because they reinforce the lab/diagram metaphor. Decorative gradients/glows without a state or flow role are excluded.

## Shapes

Use a restrained geometry vocabulary:

- actor stations: squared/technical surfaces with small 12–16px corners;
- controls: 10–12px corners and strong focus rings;
- protocol packets: compact label-like chips whose shape communicates a movable message artifact;
- status markers: text plus simple glyph/line treatment, not decorative pills everywhere.

## Components

Generic controls remain semantic HTML or reviewed accessible primitives. Product meaning belongs in semantic components/concepts such as:

- `ScenarioRail` — learning position and completed/current states;
- `ProtocolStage` — spatial relationship among Browser/App, Authorization Server, API, and Attacker;
- `ProtocolPacket` — the current simulated message/artifact;
- `ActionDeck` — current explanation, consequence, and meaningful next action;
- `ViewModeControl` — Story vs Protocol representation of the same scene;
- `SafetyModeControl` — explicit PKCE-safe vs intentionally insecure experiment state.

Specialist CSS is justified for actor placement, connection rails, moving packet cues, stage textures, and responsive spatial re-composition. Do not rebuild standard focus, button, or keyboard behavior with bespoke interaction code.

Motion is functional: it shows a packet entering/leaving an actor or a scenario state changing. Prefer transform/opacity animations and short durations. `prefers-reduced-motion: reduce` disables travel/looping motion and preserves immediate state changes.

## Do's and Don'ts

### Do

- Make the current packet and consequence understandable at first glance.
- Let the primary button name the protocol action, for example `秘密を生成する` or `code_challenge を送る`.
- Keep Story and Protocol views spatially aligned so switching modes deepens the same mental model.
- Give insecure experiment mode a persistent text warning and altered line treatment, not color alone.
- Validate Japanese wrapping and real protocol strings at wide, mobile, and 320px widths.
- Use render → critique → fix → re-render for material UI changes.

### Don't

- Do not copy the ideation concept art as a final layout specification.
- Do not use a generic Next button when the learner can perform the actual conceptual action.
- Do not introduce character art, 3D illustration, glassmorphism, glow, or motion unless it improves the protocol model.
- Do not hide required protocol meaning behind hover-only affordances.
- Do not compress the desktop stage into a tiny center card surrounded by secondary panels.
- Do not present the simulated insecure outcome as a recipe for attacking a real system.
