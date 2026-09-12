import { describe, expect, it } from "vitest";
import { buildSequence, nextStepIndex, previousStepIndex } from "./pkceScenario";

describe("PKCE learning sequence", () => {
  it("shows browser-mediated authentication plus explicit return traffic", () => {
    const events = buildSequence("safe");
    const loginUi = events.find((event) => event.id === "login-ui");
    const userInteraction = events.find((event) => event.id === "user-interaction");
    const loginSubmit = events.find((event) => event.id === "login-submit");
    const codeReturn = events.find((event) => event.id === "code-return");
    const tokenReturn = events.find((event) => event.id === "token-return");
    const apiResponse = events.find((event) => event.id === "api-response");

    expect(loginUi).toMatchObject({ from: "auth", to: "client", kind: "response" });
    expect(userInteraction).toMatchObject({ from: "user", to: "client", kind: "local" });
    expect(loginSubmit).toMatchObject({ from: "client", to: "auth", kind: "request" });
    expect(codeReturn).toMatchObject({ from: "auth", to: "client", kind: "redirect" });
    expect(tokenReturn).toMatchObject({ from: "token", to: "client", kind: "success" });
    expect(apiResponse).toMatchObject({ from: "api", to: "client", kind: "success" });
  });

  it("blocks the intercepted code with PKCE and exposes invalid_grant", () => {
    const result = buildSequence("safe").find((event) => event.id === "attacker-result");

    expect(result?.kind).toBe("error");
    expect(result?.label).toContain("invalid_grant");
    expect(result?.wire.join(" ")).toContain("400");
  });

  it("keeps the same sequence shape while making PKCE-only events visibly skipped", () => {
    const safe = buildSequence("safe");
    const insecure = buildSequence("insecure");

    expect(safe).toHaveLength(14);
    expect(insecure).toHaveLength(safe.length);
    expect(insecure[0]?.skipped).toBe(true);
    expect(insecure[1]?.skipped).toBe(true);
    expect(insecure.find((event) => event.id === "attacker-result")).toMatchObject({
      kind: "success",
      to: "attacker",
    });
    expect(insecure.find((event) => event.id === "api-request")?.from).toBe("attacker");
  });

  it("navigation skips intentionally omitted events", () => {
    const events = buildSequence("insecure");
    expect(nextStepIndex(events, 9)).toBe(12);
    expect(previousStepIndex(events, 12)).toBe(9);
    expect(nextStepIndex(events, 13)).toBe(2);
  });
});
