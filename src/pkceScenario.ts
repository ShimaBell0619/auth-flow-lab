export type ActorId = "user" | "client" | "auth" | "token" | "api";
export type EventKind = "local" | "interaction" | "request" | "response" | "redirect" | "success";
export type EventTone = "protocol" | "challenge" | "interaction" | "success";

export interface ProtocolActor {
  id: ActorId;
  name: string;
  role: string;
}

export interface FlowEvent {
  id: string;
  phase: string;
  from: ActorId;
  to: ActorId;
  kind: EventKind;
  tone: EventTone;
  packetLabel: string;
  bubble: string;
  timelineLabel: string;
}

export const actors = [
  { id: "user", name: "User", role: "Resource Owner" },
  { id: "client", name: "Browser / App", role: "Public Client" },
  { id: "auth", name: "Authorization", role: "/authorize" },
  { id: "token", name: "Token Endpoint", role: "/token" },
  { id: "api", name: "Protected API", role: "Resource Server" },
] as const satisfies readonly ProtocolActor[];

export const flowEvents = [
  {
    id: "initiate",
    phase: "SCENARIO START",
    from: "user",
    to: "client",
    kind: "interaction",
    tone: "interaction",
    packetLabel: "USER ACTION",
    bubble: "サインインを開始",
    timelineLabel: "Start",
  },
  {
    id: "verifier",
    phase: "PKCE PREP",
    from: "client",
    to: "client",
    kind: "local",
    tone: "challenge",
    packetLabel: "code_verifier",
    bubble: "code_verifier を生成",
    timelineLabel: "Verifier",
  },
  {
    id: "challenge",
    phase: "PKCE PREP",
    from: "client",
    to: "client",
    kind: "local",
    tone: "challenge",
    packetLabel: "S256 → code_challenge",
    bubble: "S256 で challenge を作る",
    timelineLabel: "Challenge",
  },
  {
    id: "authorize",
    phase: "AUTHORIZATION",
    from: "client",
    to: "auth",
    kind: "request",
    tone: "protocol",
    packetLabel: "GET /authorize + challenge",
    bubble: "challenge を付けて /authorize へ",
    timelineLabel: "Authorize",
  },
  {
    id: "login-ui",
    phase: "AUTHENTICATION",
    from: "auth",
    to: "client",
    kind: "response",
    tone: "protocol",
    packetLabel: "Login / Consent UI",
    bubble: "ログイン画面を Browser へ返す",
    timelineLabel: "Login UI",
  },
  {
    id: "user-interaction",
    phase: "AUTHENTICATION",
    from: "user",
    to: "client",
    kind: "interaction",
    tone: "interaction",
    packetLabel: "USER ACTION",
    bubble: "ログイン・同意を入力",
    timelineLabel: "User",
  },
  {
    id: "login-submit",
    phase: "AUTHENTICATION",
    from: "client",
    to: "auth",
    kind: "request",
    tone: "protocol",
    packetLabel: "Authentication / Consent",
    bubble: "認証・同意を送信",
    timelineLabel: "Submit",
  },
  {
    id: "code-return",
    phase: "AUTHORIZATION",
    from: "auth",
    to: "client",
    kind: "redirect",
    tone: "protocol",
    packetLabel: "302 · AUTH_CODE",
    bubble: "Authorization Code を返す",
    timelineLabel: "Code",
  },
  {
    id: "token-request",
    phase: "TOKEN EXCHANGE",
    from: "client",
    to: "token",
    kind: "request",
    tone: "challenge",
    packetLabel: "POST /token · code + verifier",
    bubble: "Code + verifier を送る",
    timelineLabel: "Token Req",
  },
  {
    id: "verifier-check",
    phase: "TOKEN EXCHANGE",
    from: "token",
    to: "token",
    kind: "local",
    tone: "challenge",
    packetLabel: "S256(verifier) = challenge",
    bubble: "verifier を照合",
    timelineLabel: "Verify",
  },
  {
    id: "token-return",
    phase: "TOKEN EXCHANGE",
    from: "token",
    to: "client",
    kind: "success",
    tone: "success",
    packetLabel: "200 · ACCESS_TOKEN",
    bubble: "Access Token を発行",
    timelineLabel: "Token",
  },
  {
    id: "api-request",
    phase: "RESOURCE ACCESS",
    from: "client",
    to: "api",
    kind: "request",
    tone: "protocol",
    packetLabel: "Bearer ACCESS_TOKEN",
    bubble: "Access Token で API を呼ぶ",
    timelineLabel: "API",
  },
  {
    id: "api-response",
    phase: "RESOURCE ACCESS",
    from: "api",
    to: "client",
    kind: "success",
    tone: "success",
    packetLabel: "200 · protected data",
    bubble: "保護データを返す",
    timelineLabel: "Response",
  },
] as const satisfies readonly FlowEvent[];

export const nextFlowIndex = (index: number): number =>
  Math.min(index + 1, flowEvents.length - 1);
