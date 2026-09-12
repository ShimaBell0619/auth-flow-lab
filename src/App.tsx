import { useEffect, useState, type CSSProperties } from "react";
import {
  actors,
  flowEvents,
  nextFlowIndex,
  type ActorId,
  type EventTone,
  type FlowEvent,
} from "./pkceScenario";

interface Point {
  x: number;
  y: number;
}

interface RouteGeometry {
  path: string;
  bubble: Point;
  rest: Point;
}

interface SystemBoundary {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 520;
const PACKET_TRAVEL_MS = 1900;
const ACTOR_ROUTE_RADIUS = 54;

const actorPositions: Record<ActorId, Point> = {
  user: { x: 92, y: 335 },
  client: { x: 296, y: 335 },
  auth: { x: 500, y: 335 },
  token: { x: 704, y: 335 },
  api: { x: 908, y: 335 },
};

const systemBoundaries: readonly SystemBoundary[] = [
  { id: "client-device", label: "CLIENT DEVICE", x: 190, y: 220, width: 210, height: 235 },
  {
    id: "authorization-server",
    label: "AUTHORIZATION SERVER",
    x: 410,
    y: 220,
    width: 390,
    height: 235,
  },
  { id: "resource-server", label: "RESOURCE SERVER", x: 820, y: 220, width: 165, height: 235 },
];

const routeBends: Record<string, number> = {
  initiate: -160,
  authorize: -110,
  "login-ui": -110,
  "user-interaction": 130,
  "login-submit": 150,
  "code-return": 150,
  "token-request": 170,
  "token-return": 170,
  "api-request": -200,
  "api-response": -200,
};

const bubbleNudges: Record<string, Point> = {
  initiate: { x: -34, y: -48 },
  verifier: { x: -58, y: 0 },
  challenge: { x: 64, y: 0 },
  authorize: { x: -10, y: -66 },
  "login-ui": { x: 0, y: 34 },
  "user-interaction": { x: 0, y: 34 },
  "login-submit": { x: 12, y: 28 },
  "code-return": { x: 16, y: -44 },
  "token-request": { x: 0, y: 12 },
  "verifier-check": { x: 0, y: 0 },
  "token-return": { x: 0, y: -34 },
  "api-request": { x: 12, y: -44 },
  "api-response": { x: 18, y: 4 },
};

const markerForTone = (tone: EventTone) => `url(#arrow-${tone})`;

const getRouteGeometry = (event: FlowEvent): RouteGeometry => {
  const sourceCenter = actorPositions[event.from];
  const targetCenter = actorPositions[event.to];
  const nudge = bubbleNudges[event.id] ?? { x: 0, y: 0 };

  if (event.from === event.to) {
    const loopHeight = event.id === "challenge" ? 118 : event.id === "verifier-check" ? 94 : 78;
    const base = { x: sourceCenter.x, y: sourceCenter.y - ACTOR_ROUTE_RADIUS };
    const path = `M ${base.x} ${base.y} C ${base.x - 72} ${base.y - loopHeight}, ${base.x + 72} ${base.y - loopHeight}, ${base.x} ${base.y}`;
    return {
      path,
      bubble: { x: base.x + nudge.x, y: base.y - loopHeight - 28 + nudge.y },
      rest: { x: base.x, y: base.y - loopHeight * 0.72 },
    };
  }

  const centerDx = targetCenter.x - sourceCenter.x;
  const centerDy = targetCenter.y - sourceCenter.y;
  const centerLength = Math.max(Math.hypot(centerDx, centerDy), 1);
  const unitX = centerDx / centerLength;
  const unitY = centerDy / centerLength;
  const start = {
    x: sourceCenter.x + unitX * ACTOR_ROUTE_RADIUS,
    y: sourceCenter.y + unitY * ACTOR_ROUTE_RADIUS,
  };
  const end = {
    x: targetCenter.x - unitX * ACTOR_ROUTE_RADIUS,
    y: targetCenter.y - unitY * ACTOR_ROUTE_RADIUS,
  };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const bend = routeBends[event.id] ?? 0;
  const normalX = -dy / length;
  const normalY = dx / length;
  const control = {
    x: (start.x + end.x) / 2 + normalX * bend,
    y: (start.y + end.y) / 2 + normalY * bend,
  };
  const midpoint = {
    x: start.x * 0.25 + control.x * 0.5 + end.x * 0.25,
    y: start.y * 0.25 + control.y * 0.5 + end.y * 0.25,
  };

  return {
    path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
    bubble: {
      x: Math.min(910, Math.max(90, midpoint.x + nudge.x)),
      y: Math.min(455, Math.max(66, midpoint.y + nudge.y)),
    },
    rest: end,
  };
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function ActorIcon({ actor }: { actor: ActorId }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (actor === "user") {
    return (
      <svg {...common}>
        <title>User</title>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
      </svg>
    );
  }
  if (actor === "client") {
    return (
      <svg {...common}>
        <title>Browser / App</title>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4M6.5 8h.01M9.5 8h.01" />
      </svg>
    );
  }
  if (actor === "auth") {
    return (
      <svg {...common}>
        <title>Authorization</title>
        <path d="M12 3 4.5 6v5.5c0 4.3 2.7 7.5 7.5 9.5 4.8-2 7.5-5.2 7.5-9.5V6L12 3Z" />
        <path d="M9.5 12h5M12 9.5V14.5" />
      </svg>
    );
  }
  if (actor === "token") {
    return (
      <svg {...common}>
        <title>Token Endpoint</title>
        <circle cx="8" cy="12" r="4" />
        <path d="M12 12h9M17 12v3M20 12v2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <title>Protected API</title>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function ActorNode({ actor, activeEvent }: { actor: (typeof actors)[number]; activeEvent: FlowEvent }) {
  const position = actorPositions[actor.id];
  const isSource = activeEvent.from === actor.id;
  const isTarget = activeEvent.to === actor.id;
  const className = [
    "actor-node",
    `actor-${actor.id}`,
    isSource ? "is-source" : "",
    isTarget ? "is-target" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style = {
    left: `${(position.x / STAGE_WIDTH) * 100}%`,
    top: `${(position.y / STAGE_HEIGHT) * 100}%`,
  } satisfies CSSProperties;

  return (
    <div className={className} style={style}>
      <span className="actor-symbol">
        <ActorIcon actor={actor.id} />
      </span>
      <strong>{actor.name}</strong>
      <small>{actor.role}</small>
    </div>
  );
}

function SystemBoundaryLayer() {
  return (
    <div className="boundary-layer">
      {systemBoundaries.map((boundary) => {
        const style = {
          left: `${(boundary.x / STAGE_WIDTH) * 100}%`,
          top: `${(boundary.y / STAGE_HEIGHT) * 100}%`,
          width: `${(boundary.width / STAGE_WIDTH) * 100}%`,
          height: `${(boundary.height / STAGE_HEIGHT) * 100}%`,
        } satisfies CSSProperties;

        return (
          <div
            key={boundary.id}
            className={`system-boundary boundary-${boundary.id}`}
            style={style}
            data-testid="system-boundary"
          >
            <span>{boundary.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProtocolStage({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  const activeEvent = flowEvents[activeIndex] ?? flowEvents[0];
  const activeRoute = getRouteGeometry(activeEvent);
  const bubbleStyle = {
    left: `${(activeRoute.bubble.x / STAGE_WIDTH) * 100}%`,
    top: `${(activeRoute.bubble.y / STAGE_HEIGHT) * 100}%`,
  } satisfies CSSProperties;

  return (
    <section
      className="protocol-stage"
      aria-label="Authorization Code + PKCE 通信ステージ"
      data-step={activeEvent.id}
      data-motion={reducedMotion ? "reduced" : "full"}
    >
      <SystemBoundaryLayer />

      <svg
        className="route-layer"
        viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker id="arrow-trail" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          {(["protocol", "challenge", "interaction", "success"] as const).map((tone) => (
            <marker
              id={`arrow-${tone}`}
              key={tone}
              className={`arrow-marker tone-${tone}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          ))}
        </defs>

        {flowEvents.slice(0, activeIndex).map((event) => {
          const route = getRouteGeometry(event);
          return (
            <path
              key={event.id}
              d={route.path}
              className={`completed-trail ${event.kind === "interaction" ? "is-interaction" : ""}`}
              markerEnd="url(#arrow-trail)"
              vectorEffect="non-scaling-stroke"
              data-testid="completed-trail"
            />
          );
        })}

        <g key={`active-${activeEvent.id}`}>
          <path
            d={activeRoute.path}
            className={`active-route tone-${activeEvent.tone} ${activeEvent.kind === "interaction" ? "is-interaction" : ""}`}
            markerEnd={markerForTone(activeEvent.tone)}
            vectorEffect="non-scaling-stroke"
            data-from={activeEvent.from}
            data-to={activeEvent.to}
            data-testid="active-route"
          />

          {reducedMotion ? (
            <g data-testid="active-packet-static">
              <circle cx={activeRoute.rest.x} cy={activeRoute.rest.y} r="13" className={`packet-halo tone-${activeEvent.tone}`} />
              <circle cx={activeRoute.rest.x} cy={activeRoute.rest.y} r="5.5" className={`packet-core tone-${activeEvent.tone}`} />
            </g>
          ) : (
            <g data-testid="active-packet">
              <circle r="15" className={`packet-halo tone-${activeEvent.tone}`}>
                <animateMotion path={activeRoute.path} dur={`${PACKET_TRAVEL_MS}ms`} fill="freeze" />
              </circle>
              <circle r="5.5" className={`packet-core tone-${activeEvent.tone}`}>
                <animateMotion path={activeRoute.path} dur={`${PACKET_TRAVEL_MS}ms`} fill="freeze" />
              </circle>
            </g>
          )}
        </g>
      </svg>

      <div className="actor-layer">
        {actors.map((actor) => (
          <ActorNode key={actor.id} actor={actor} activeEvent={activeEvent} />
        ))}
      </div>

      <div className={`flow-bubble tone-${activeEvent.tone}`} style={bubbleStyle} data-testid="flow-bubble">
        <strong>{activeEvent.bubble}</strong>
        <code>{activeEvent.packetLabel}</code>
      </div>
    </section>
  );
}

function FlowTimeline({ activeIndex, onSelect }: { activeIndex: number; onSelect: (index: number) => void }) {
  return (
    <nav className="timeline-scroll" aria-label="通信ステップ">
      <div className="flow-timeline">
        {flowEvents.map((event, index) => {
          const state = index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming";
          return (
            <button
              type="button"
              key={event.id}
              className={`timeline-step is-${state}`}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${event.timelineLabel}`}
              onClick={() => onSelect(index)}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <span className="timeline-label">{event.timelineLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!autoPlay || activeIndex >= flowEvents.length - 1) return;

    const delay = reducedMotion ? 2200 : 2850;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => nextFlowIndex(current));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoPlay, reducedMotion]);

  const selectStep = (index: number) => {
    setAutoPlay(false);
    setActiveIndex(index);
  };

  return (
    <main className="app-shell">
      <header className="stage-header">
        <span className="brand-mark" aria-hidden="true">A/</span>
        <div>
          <p className="brand-name">AUTH FLOW LAB</p>
          <h1>Authorization Code + PKCE</h1>
        </div>
      </header>

      <div className="stage-scroll">
        <ProtocolStage activeIndex={activeIndex} reducedMotion={reducedMotion} />
      </div>

      <FlowTimeline activeIndex={activeIndex} onSelect={selectStep} />
    </main>
  );
}

export default App;
