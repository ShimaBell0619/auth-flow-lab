export type ScenarioStepId =
  | "secret"
  | "challenge"
  | "authorize"
  | "intercept"
  | "exchange"
  | "api";

export type FlowMode = "safe" | "insecure";
export type ViewMode = "story" | "protocol";

export interface ScenarioStep {
  id: ScenarioStepId;
  shortLabel: string;
  actor: string;
  storyTitle: string;
  storyBody: string;
  protocolTitle: string;
  protocolBody: string;
  wire: readonly string[];
  packet: string;
  nextAction: string;
}

export const scenarioSteps: readonly ScenarioStep[] = [
  {
    id: "secret",
    shortLabel: "Secret",
    actor: "Browser / App",
    storyTitle: "秘密の原本を、ブラウザの中だけで作る",
    storyBody:
      "まずアプリだけが知るランダムな秘密を作ります。これが code_verifier。まだ外には送りません。",
    protocolTitle: "code_verifier を生成",
    protocolBody:
      "PKCEクライアントは高エントロピーな code_verifier を生成し、後のトークン交換まで保持します。",
    wire: [
      "code_verifier = high_entropy_random(43..128 unreserved chars)",
      "local only · not transmitted yet",
    ],
    packet: "code_verifier",
    nextAction: "秘密を生成する",
  },
  {
    id: "challenge",
    shortLabel: "Challenge",
    actor: "Browser → Authorization Server",
    storyTitle: "秘密そのものではなく、秘密の“指紋”を送る",
    storyBody:
      "code_verifier を変換した code_challenge だけを認可サーバーへ渡します。秘密の原本はブラウザに残ります。",
    protocolTitle: "S256 code_challenge を認可要求へ",
    protocolBody:
      "S256では verifier をSHA-256で変換し、base64url化した値を code_challenge として送ります。",
    wire: [
      "code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))",
      "GET /authorize?...&code_challenge=...&code_challenge_method=S256",
    ],
    packet: "code_challenge",
    nextAction: "code_challenge を送る",
  },
  {
    id: "authorize",
    shortLabel: "Login",
    actor: "Authorization Server → Browser",
    storyTitle: "認証のあと、一度限りの引換券が戻ってくる",
    storyBody:
      "ログインと同意が完了すると、ブラウザには Authorization Code が返ります。これはまだAPI入場証ではありません。",
    protocolTitle: "Authorization Code をリダイレクトで返却",
    protocolBody:
      "認可サーバーは登録済み redirect_uri へ短命な code を返します。Access Tokenはこの時点では返しません。",
    wire: ["302 <redirect_uri>?code=AUTH_CODE", "AUTH_CODE ≠ access_token"],
    packet: "Authorization Code",
    nextAction: "ログインして認可コードを受け取る",
  },
  {
    id: "intercept",
    shortLabel: "Intercept",
    actor: "Attacker",
    storyTitle: "攻撃者が、引換券だけを横取りした",
    storyBody:
      "ここではコードが攻撃者に漏れた状況を単純化して再現します。PKCEの価値は、この次の交換で見えてきます。",
    protocolTitle: "Authorization Code interception を再現",
    protocolBody:
      "攻撃者は AUTH_CODE を入手しました。ただしPKCEが有効なら、最初に作った code_verifier は持っていません。",
    wire: ["attacker obtains: AUTH_CODE", "attacker does not obtain: code_verifier"],
    packet: "stolen AUTH_CODE",
    nextAction: "攻撃者に交換させてみる",
  },
  {
    id: "exchange",
    shortLabel: "Token",
    actor: "Token Endpoint",
    storyTitle: "同じ引換券でも、“秘密の原本”が結果を分ける",
    storyBody:
      "PKCEが有効なら、攻撃者は verifier を示せず交換に失敗します。正規アプリだけが対応する verifier を提示できます。",
    protocolTitle: "Token Endpoint が verifier を照合",
    protocolBody:
      "code_verifier から再計算した challenge と、認可時に保持した challenge が一致する場合だけコード交換が成立します。",
    wire: [
      "POST /token code=AUTH_CODE&code_verifier=...",
      "mismatch / missing verifier → invalid_grant",
    ],
    packet: "token exchange",
    nextAction: "正規アプリで交換を完了する",
  },
  {
    id: "api",
    shortLabel: "API",
    actor: "Browser → Resource API",
    storyTitle: "API入場証を持つ主体だけが、リソースへ進む",
    storyBody:
      "保護された流れでは正規アプリがAccess Tokenを取得します。これでPKCEが守っている境界を一周しました。",
    protocolTitle: "Access Token で Resource Server へ",
    protocolBody:
      "Authorization CodeはAPIへ送らず、Token Endpointで得たAccess Tokenをリソース要求へ使用します。",
    wire: ["Authorization: Bearer ACCESS_TOKEN", "GET /resource"],
    packet: "Access Token",
    nextAction: "安全な流れをもう一度見る",
  },
] as const;

export const nextStepIndex = (index: number): number =>
  index >= scenarioSteps.length - 1 ? 0 : index + 1;

export const exchangeOutcome = (mode: FlowMode) => {
  if (mode === "safe") {
    return {
      label: "攻撃失敗",
      detail:
        "攻撃者は code_verifier を持たないため、盗んだAuthorization CodeだけではTokenを取得できません。",
      wire: "400 invalid_grant · verifier missing/mismatch",
      compromised: false,
    } as const;
  }

  return {
    label: "攻撃成功（実験）",
    detail:
      "この単純化した実験ではPKCEがないため、先にコードを交換した攻撃者がAccess Tokenを取得します。",
    wire: "200 simulated_access_token · PKCE intentionally disabled",
    compromised: true,
  } as const;
};

export const apiOutcome = (mode: FlowMode) =>
  mode === "safe"
    ? {
        label: "正規アプリがAPIへ",
        detail: "Access Tokenの保持主体は正規アプリです。",
      }
    : {
        label: "攻撃者がAPIへ（実験）",
        detail: "比較用の意図的に危険なシミュレーション状態です。",
      };
