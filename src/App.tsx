import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  actors,
  buildSequence,
  nextStepIndex,
  previousStepIndex,
  type ActorId,
  type FlowMode,
  type SequenceEvent,
  type ViewMode,
} from "./pkceScenario";

const actorIndex = Object.fromEntries(actors.map((actor, index) => [actor.id, index])) as Record<
  ActorId,
  number
>;

const actorName = Object.fromEntries(actors.map((actor) => [actor.id, actor.name])) as Record<
  ActorId,
  string
>;

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
        <title>{actorName[actor]}</title>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
      </svg>
    );
  }
  if (actor === "client") {
    return (
      <svg {...common}>
        <title>{actorName[actor]}</title>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4M6.5 8h.01M9.5 8h.01" />
      </svg>
    );
  }
  if (actor === "auth") {
    return (
      <svg {...common}>
        <title>{actorName[actor]}</title>
        <path d="M12 3 4.5 6v5.5c0 4.3 2.7 7.5 7.5 9.5 4.8-2 7.5-5.2 7.5-9.5V6L12 3Z" />
        <path d="M9.5 12h5M12 9.5V14.5" />
      </svg>
    );
  }
  if (actor === "token") {
    return (
      <svg {...common}>
        <title>{actorName[actor]}</title>
        <circle cx="8" cy="12" r="4" />
        <path d="M12 12h9M17 12v3M20 12v2" />
      </svg>
    );
  }
  if (actor === "api") {
    return (
      <svg {...common}>
        <title>{actorName[actor]}</title>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <title>{actorName[actor]}</title>
      <path d="M4 8.5 7 5h10l3 3.5-2 9-6 3-6-3-2-9Z" />
      <path d="M8 11h2M14 11h2M9.5 15c1.5 1 3.5 1 5 0" />
    </svg>
  );
}

function ViewControl({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <fieldset className="view-control">
      <legend className="sr-only">説明の解像度</legend>
      {(["story", "protocol", "wire"] as const).map((mode) => (
        <button
          type="button"
          key={mode}
          className={value === mode ? "is-selected" : ""}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
        >
          {mode === "story" ? "Story" : mode === "protocol" ? "Protocol" : "Wire"}
        </button>
      ))}
    </fieldset>
  );
}

function ActorHeader({ actor }: { actor: (typeof actors)[number] }) {
  return (
    <div className={`actor-header actor-${actor.id}`}>
      <span className="actor-icon">
        <ActorIcon actor={actor.id} />
      </span>
      <span className="actor-copy">
        <strong>{actor.name}</strong>
        <small>{actor.role}</small>
      </span>
    </div>
  );
}

function SequenceEventRow({
  event,
  index,
  activeIndex,
  onSelect,
}: {
  event: SequenceEvent;
  index: number;
  activeIndex: number;
  onSelect: () => void;
}) {
  const from = actorIndex[event.from];
  const to = actorIndex[event.to];
  const laneWidth = 100 / actors.length;
  const fromCenter = (from + 0.5) * laneWidth;
  const toCenter = (to + 0.5) * laneWidth;
  const self = from === to;
  const left = self ? fromCenter - laneWidth * 0.34 : Math.min(fromCenter, toCenter);
  const width = self ? laneWidth * 0.68 : Math.abs(toCenter - fromCenter);
  const direction = self ? "self" : from < to ? "forward" : "reverse";
  const progress = event.skipped
    ? "skipped"
    : index < activeIndex
      ? "complete"
      : index === activeIndex
        ? "current"
        : "upcoming";
  const style = { left: `${left}%`, width: `${width}%` } satisfies CSSProperties;

  return (
    <button
      type="button"
      className={`sequence-event is-${progress} event-${event.kind}`}
      aria-current={index === activeIndex ? "step" : undefined}
      aria-label={`${index + 1}. ${event.label}${event.skipped ? "（PKCE OFFでスキップ）" : ""}`}
      onClick={onSelect}
    >
      <span className="event-number" aria-hidden="true">
        {event.skipped ? "—" : String(index + 1).padStart(2, "0")}
      </span>
      <span className="event-lanes">
        <span className={`event-track direction-${direction}`} style={style}>
          <span className="event-caption">
            <strong>{event.label}</strong>
            <small>{event.phase}</small>
          </span>
        </span>
      </span>
    </button>
  );
}

function DetailSection({ children }: { children: ReactNode }) {
  return <div className="detail-section">{children}</div>;
}

function App() {
  const [flowMode, setFlowMode] = useState<FlowMode>("safe");
  const [viewMode, setViewMode] = useState<ViewMode>("story");
  const [stepIndex, setStepIndex] = useState(0);
  const events = useMemo(() => buildSequence(flowMode), [flowMode]);
  const currentEvent = events[stepIndex] ?? events[0];
  const isUnsafe = flowMode === "insecure";

  const toggleSafetyMode = () => {
    const nextMode: FlowMode = isUnsafe ? "safe" : "insecure";
    setFlowMode(nextMode);
    setStepIndex(nextMode === "safe" ? 0 : 2);
  };

  const advance = () => setStepIndex((current) => nextStepIndex(events, current));
  const goBack = () => setStepIndex((current) => previousStepIndex(events, current));

  const detailTitle = viewMode === "story" ? currentEvent.storyTitle : currentEvent.protocolTitle;
  const detailBody = viewMode === "story" ? currentEvent.storyBody : currentEvent.protocolBody;

  return (
    <main className={`app-shell ${isUnsafe ? "mode-insecure" : "mode-safe"}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">A/</span>
          <div>
            <p className="brand-name">AUTH FLOW LAB</p>
            <p className="brand-subtitle">Authorization Code + PKCE</p>
          </div>
        </div>

        <div className="topbar-controls">
          <ViewControl value={viewMode} onChange={setViewMode} />
          <button
            type="button"
            className={`break-button ${isUnsafe ? "is-restoring" : ""}`}
            onClick={toggleSafetyMode}
          >
            {isUnsafe ? "PKCEを戻す" : "Break it · PKCEを切る"}
          </button>
        </div>
      </header>

      <section className="lesson-toolbar" aria-labelledby="lesson-title">
        <div className="lesson-title-block">
          <p className="lesson-kicker">INTERACTIVE SEQUENCE · LESSON 01</p>
          <h1 id="lesson-title">コードを盗まれても、なぜTokenへ交換できない？</h1>
        </div>
        <div className={`safety-status ${isUnsafe ? "is-unsafe" : "is-safe"}`} aria-live="polite">
          <span className="status-symbol" aria-hidden="true">{isUnsafe ? "!" : "✓"}</span>
          <span>
            <strong>{isUnsafe ? "実験モード · PKCE OFF" : "推奨フロー · PKCE ON"}</strong>
            <small>
              {isUnsafe
                ? "比較のためPKCEを意図的に無効化"
                : "S256 challenge と verifier でCode交換を結び付ける"}
            </small>
          </span>
        </div>
      </section>

      <div className="workspace">
        <section className="sequence-panel" aria-label="PKCE通信シーケンス">
          <div className="sequence-panel-heading">
            <div>
              <span className="panel-index">FLOW / 01</span>
              <strong>誰が、誰に、何を返しているか</strong>
            </div>
            <span className="sequence-hint">行を選択して通信を詳しく見る</span>
          </div>

          <div className="sequence-scroll">
            <div className="sequence-canvas">
              <div className="actor-row">
                <span className="actor-row-spacer" aria-hidden="true" />
                {actors.map((actor) => <ActorHeader key={actor.id} actor={actor} />)}
              </div>

              <div className="sequence-body">
                <div className="lifelines" aria-hidden="true">
                  {actors.map((actor) => <span className={`lifeline lifeline-${actor.id}`} key={actor.id} />)}
                </div>
                <div className="sequence-events">
                  {events.map((event, index) => (
                    <SequenceEventRow
                      event={event}
                      index={index}
                      activeIndex={stepIndex}
                      onSelect={() => setStepIndex(index)}
                      key={event.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="inspector" aria-label="選択中の通信の説明">
          <div className="inspector-meta">
            <span>{String(stepIndex + 1).padStart(2, "0")} / {events.length}</span>
            <span className={`kind-label kind-${currentEvent.kind}`}>{currentEvent.kind.toUpperCase()}</span>
          </div>

          <DetailSection>
            <p className="detail-kicker">NOW SELECTED</p>
            <div className="route-summary">
              <span>{actorName[currentEvent.from]}</span>
              <span className="route-arrow" aria-hidden="true">→</span>
              <span>{actorName[currentEvent.to]}</span>
            </div>
            <h2>{detailTitle}</h2>
            {viewMode !== "wire" ? <p className="detail-body">{detailBody}</p> : null}
          </DetailSection>

          {viewMode === "wire" ? (
            <DetailSection>
              <p className="detail-kicker">WIRE MESSAGE · REPRESENTATIVE</p>
              <pre className="wire-block"><code>{currentEvent.wire.join("\n")}</code></pre>
              <p className="wire-note">値は教材用の合成例です。PKCE以外の防御要素はこのレッスンの主題に必要な範囲だけ表示します。</p>
            </DetailSection>
          ) : (
            <DetailSection>
              <p className="detail-kicker">MESSAGE</p>
              <code className="message-chip">{currentEvent.label}</code>
            </DetailSection>
          )}

          {isUnsafe ? (
            <div className="unsafe-note">
              <strong>意図的に危険な比較</strong>
              <p>この経路は教材上のローカルシミュレーションです。Public ClientでPKCEを外す実装を推奨するものではありません。</p>
            </div>
          ) : null}

          <div className="inspector-actions">
            <button type="button" className="secondary-action" onClick={goBack} aria-label="前の通信を見る">
              ← <span>前の通信</span>
            </button>
            <button type="button" className="primary-action" onClick={advance}>
              <span>{currentEvent.action}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </aside>
      </div>

      <footer className="footnote">
        Educational simulation · synthetic values only · Authorization and Token are separated into lanes to make endpoint roles visible.
      </footer>
    </main>
  );
}

export default App;
