import { describe, expect, it } from "vitest";
import { actors, flowEvents, nextFlowIndex } from "./pkceScenario";

describe("PKCE normal-flow model", () => {
  it("keeps one normal flow with five stable actors and no attacker branch", () => {
    expect(actors.map((actor) => actor.id)).toEqual(["user", "client", "auth", "token", "api"]);
    expect(flowEvents).toHaveLength(13);
    expect(flowEvents.some((event) => event.id.includes("attacker"))).toBe(false);
  });

  it("starts from scenario-level user intent before PKCE preparation", () => {
    expect(flowEvents[0]).toMatchObject({
      id: "initiate",
      from: "user",
      to: "client",
      kind: "interaction",
      packetLabel: "USER ACTION",
    });
    expect(flowEvents[1]).toMatchObject({ id: "verifier", from: "client", to: "client", kind: "local" });
    expect(flowEvents[2]).toMatchObject({ id: "challenge", from: "client", to: "client", kind: "local" });
  });

  it("separates local PKCE work, human interaction, requests, and return traffic", () => {
    expect(flowEvents.find((event) => event.id === "user-interaction")).toMatchObject({
      from: "user",
      to: "client",
      kind: "interaction",
    });
    expect(flowEvents.find((event) => event.id === "login-ui")).toMatchObject({
      from: "auth",
      to: "client",
      kind: "response",
    });
    expect(flowEvents.find((event) => event.id === "code-return")).toMatchObject({
      from: "auth",
      to: "client",
      kind: "redirect",
    });
    expect(flowEvents.find((event) => event.id === "token-return")).toMatchObject({
      from: "token",
      to: "client",
      kind: "success",
    });
    expect(flowEvents.find((event) => event.id === "api-response")).toMatchObject({
      from: "api",
      to: "client",
      kind: "success",
    });
  });

  it("keeps in-stage bubble copy concise", () => {
    expect(Math.max(...flowEvents.map((event) => event.bubble.length))).toBeLessThanOrEqual(32);
  });

  it("stops progression at the final event", () => {
    expect(nextFlowIndex(0)).toBe(1);
    expect(nextFlowIndex(flowEvents.length - 1)).toBe(flowEvents.length - 1);
  });
});
