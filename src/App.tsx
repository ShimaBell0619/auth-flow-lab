import { useMemo, useState } from "react";
import {
  apiOutcome,
  exchangeOutcome,
  nextStepIndex,
  scenarioSteps,
  type FlowMode,
  type ViewMode,
} from "./pkceScenario";

const stepTone = (index: number, activeIndex: number, isUnsafe: boolean) => {
  if (isUnsafe && index < 2) return "skipped";
  if (index < activeIndex) return "complete";
  if (index === activeIndex) return "current";
  return "upcoming";
};

function Actor({
  id,
  eyebrow,
  title,
  detail,
  active,
}: {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  active: boolean;
}) {
  return (
    <section className={`actor actor-${id}${active ? " is-active" : ""}`} aria-label={title}>
      <span className="actor-index" aria-hidden="true">
        {id === "browser" ? "01" : id === "auth" ? "02" : id === "api" ? "03" : "X"}
      </span>
      <p className="actor-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{detail}</p>
    </section>
  );
}

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [flowMode, setFlowMode] = useState<FlowMode>("safe");
  const [viewMode, setViewMode] = useState<ViewMode>("story");

  const step = scenarioSteps[stepIndex];
  const exchange = useMemo(() => exchangeOutcome(flowMode), [flowMode]);
  const api = useMemo(() => apiOutcome(flowMode), [flowMode]);
  const isExchange = step.id === "exchange";
  const isApi = step.id === "api";
  const isUnsafe = flowMode === "insecure";

  const toggleSafetyMode = () => {
    if (flowMode === "safe") {
      setFlowMode("insecure");
      setStepIndex(2);
      return;
    }

    setFlowMode("safe");
    setStepIndex(0);
  };

  const advance = () => {
    if (step.id === "api" && isUnsafe) {
      setFlowMode("safe");
      setStepIndex(0);
      return;
    }
    setStepIndex((current) => nextStepIndex(current));
  };

  const actionLabel =
    step.id === "api" && isUnsafe ? "PKCEを戻して再実験する" : step.nextAction;

  return (
    <main className={`app-shell ${isUnsafe ? "mode-insecure" : "mode-safe"}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            A/
          </span>
          <div>
            <p className="brand-name">AUTH FLOW LAB</p>
            <p className="brand-subtitle">PKCE · INTERACTIVE 01</p>
          </div>
        </div>

        <div className="topbar-controls">
          <div className="view-control" role="group" aria-label="表示モード">
            <button
              type="button"
              className={viewMode === "story" ? "is-selected" : ""}
              aria-pressed={viewMode === "story"}
              onClick={() => setViewMode("story")}
            >
              Story
            </button>
            <button
              type="button"
              className={viewMode === "protocol" ? "is-selected" : ""}
              aria-pressed={viewMode === "protocol"}
              onClick={() => setViewMode("protocol")}
            >
              Protocol
            </button>
          </div>
          <button
            type="button"
            className={`break-button ${isUnsafe ? "is-restoring" : ""}`}
            onClick={toggleSafetyMode}
          >
            {isUnsafe ? "PKCEを戻す" : "Break it · PKCEを切る"}
          </button>
        </div>
      </header>

      <section className="lesson-frame" aria-labelledby="lesson-title">
        <div className="lesson-heading">
          <div>
            <p className="lesson-kicker">Authorization Code + PKCE</p>
            <h1 id="lesson-title">コードを盗まれても、なぜ交換できない？</h1>
          </div>
          <div
            className={`safety-status ${isUnsafe ? "is-unsafe" : "is-safe"}`}
            aria-live="polite"
          >
            <span className="status-symbol" aria-hidden="true">
              {isUnsafe ? "!" : "✓"}
            </span>
            <span>
              <strong>{isUnsafe ? "実験モード · PKCE OFF" : "推奨フロー · PKCE ON"}</strong>
              <small>
                {isUnsafe
                  ? "verifier / challenge を使わない比較用シミュレーション"
                  : "code_verifier でコード交換を結び付ける"}
              </small>
            </span>
          </div>
        </div>

        <nav className="scenario-rail" aria-label="PKCE学習ステップ">
          {scenarioSteps.map((railStep, index) => {
            const skipped = isUnsafe && index < 2;
            return (
              <button
                type="button"
                key={railStep.id}
                className={`rail-step is-${stepTone(index, stepIndex, isUnsafe)}`}
                aria-current={index === stepIndex ? "step" : undefined}
                disabled={skipped}
                title={skipped ? "PKCE OFFではこの工程を使用しません" : undefined}
                onClick={() => setStepIndex(index)}
              >
                <span className="rail-dot" aria-hidden="true">
                  {skipped ? "—" : index < stepIndex ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span>{skipped ? `${railStep.shortLabel} · SKIP` : railStep.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        <div className="protocol-stage" data-step={step.id}>
          <div className="stage-grid" aria-hidden="true" />
          <svg className="flow-map" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true">
            <path className="flow-line flow-main" d="M 190 190 C 300 90, 390 90, 500 190 S 700 290, 815 185" />
            <path className="flow-line flow-attack" d="M 515 210 C 520 300, 500 340, 470 390" />
            <path className="flow-line flow-return" d="M 805 200 C 710 300, 630 325, 530 250" />
          </svg>

          <Actor
            id="browser"
            eyebrow="PUBLIC CLIENT"
            title="Browser / App"
            detail={isUnsafe ? "Authorization Codeを受け取る" : "秘密の原本を保持"}
            active={["secret", "challenge", "authorize", "exchange"].includes(step.id)}
          />
          <Actor
            id="auth"
            eyebrow="AUTHORIZATION SERVER"
            title="Auth Server"
            detail={isUnsafe ? "code を発行・交換" : "challenge と code を関連付ける"}
            active={["challenge", "authorize", "exchange"].includes(step.id)}
          />
          <Actor
            id="api"
            eyebrow="RESOURCE SERVER"
            title="API"
            detail="Access Token を検証"
            active={step.id === "api"}
          />
          <Actor
            id="attacker"
            eyebrow="SIMULATED ATTACKER"
            title="Interceptor"
            detail="Authorization Codeだけを取得"
            active={["intercept", "exchange", "api"].includes(step.id)}
          />

          <div className={`protocol-packet packet-${step.id}`} aria-live="polite">
            <span className="packet-pulse" aria-hidden="true" />
            <span className="packet-label">{step.packet}</span>
          </div>

          {isExchange ? (
            <div className={`outcome-flag ${exchange.compromised ? "is-compromised" : "is-blocked"}`}>
              <span aria-hidden="true">{exchange.compromised ? "!" : "×"}</span>
              <strong>{exchange.label}</strong>
            </div>
          ) : null}
          {isApi && isUnsafe ? (
            <div className="outcome-flag is-compromised api-compromise">
              <span aria-hidden="true">!</span>
              <strong>{api.label}</strong>
            </div>
          ) : null}

          <div className="stage-label stage-label-a">A · create proof</div>
          <div className="stage-label stage-label-b">B · bind code</div>
          <div className="stage-label stage-label-c">C · exchange</div>
        </div>

        <section className="action-deck" aria-label="現在の学習内容">
          <div className="step-number" aria-hidden="true">
            {String(stepIndex + 1).padStart(2, "0")}
          </div>
          <div className="step-copy" aria-live="polite">
            <p className="step-actor">{step.actor}</p>
            <h2>{viewMode === "story" ? step.storyTitle : step.protocolTitle}</h2>
            <p>
              {isExchange
                ? exchange.detail
                : isApi && isUnsafe
                  ? api.detail
                  : viewMode === "story"
                    ? step.storyBody
                    : step.protocolBody}
            </p>
          </div>

          <div className="wire-readout" data-visible={viewMode === "protocol"}>
            <span className="readout-label">LIVE PROTOCOL</span>
            <code>{isExchange ? exchange.wire : step.wire[0]}</code>
            <code>{isExchange ? step.wire[1] : (step.wire[1] ?? "")}</code>
          </div>

          <button type="button" className="primary-action" onClick={advance}>
            <span>{actionLabel}</span>
            <span className="action-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </section>
      </section>

      <p className="footnote">
        Educational simulation · synthetic values only · Story is simplified, Protocol keeps the real terms.
      </p>
    </main>
  );
}

export default App;
