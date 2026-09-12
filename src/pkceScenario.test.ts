import { describe, expect, it } from "vitest";
import {
  apiOutcome,
  exchangeOutcome,
  nextStepIndex,
  scenarioSteps,
} from "./pkceScenario";

describe("PKCE learning scenario", () => {
  it("advances through each learning action and loops after the final scene", () => {
    expect(nextStepIndex(0)).toBe(1);
    expect(nextStepIndex(scenarioSteps.length - 2)).toBe(scenarioSteps.length - 1);
    expect(nextStepIndex(scenarioSteps.length - 1)).toBe(0);
  });

  it("blocks the intercepted-code exchange when PKCE is enabled", () => {
    const outcome = exchangeOutcome("safe");

    expect(outcome.compromised).toBe(false);
    expect(outcome.label).toBe("攻撃失敗");
    expect(outcome.wire).toContain("invalid_grant");
  });

  it("shows the intentionally insecure comparison when PKCE is disabled", () => {
    const outcome = exchangeOutcome("insecure");

    expect(outcome.compromised).toBe(true);
    expect(outcome.label).toContain("実験");
    expect(apiOutcome("insecure").label).toContain("攻撃者");
  });
});
