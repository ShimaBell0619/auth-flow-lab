export type FlowMode = "safe" | "insecure";
export type ViewMode = "story" | "protocol" | "wire";
export type ActorId = "user" | "client" | "auth" | "token" | "api" | "attacker";
export type EventKind =
  | "local"
  | "request"
  | "response"
  | "redirect"
  | "attack"
  | "error"
  | "success"
  | "skipped";

export interface SequenceEvent {
  id: string;
  phase: string;
  from: ActorId;
  to: ActorId;
  kind: EventKind;
  label: string;
  storyTitle: string;
  storyBody: string;
  protocolTitle: string;
  protocolBody: string;
  wire: readonly string[];
  action: string;
  skipped?: boolean;
}

export const actors = [
  { id: "user", name: "User", role: "Resource Owner" },
  { id: "client", name: "Browser / App", role: "Public Client" },
  { id: "auth", name: "Authorization", role: "/authorize endpoint" },
  { id: "token", name: "Token Endpoint", role: "/token endpoint" },
  { id: "api", name: "Protected API", role: "Resource Server" },
  { id: "attacker", name: "Attacker", role: "Simulated interceptor" },
] as const satisfies readonly { id: ActorId; name: string; role: string }[];

const safeEvents: readonly SequenceEvent[] = [
  {
    id: "verifier",
    phase: "PKCE PREP",
    from: "client",
    to: "client",
    kind: "local",
    label: "code_verifier を生成",
    storyTitle: "まず、アプリだけが知る長い秘密を作る",
    storyBody:
      "この秘密は code_verifier。あとでAuthorization CodeをTokenへ交換するときまで、Browser / Appの中だけに保持します。",
    protocolTitle: "Client creates a code_verifier",
    protocolBody:
      "PKCEクライアントは各Authorization Requestごとに43〜128文字の高エントロピーな code_verifier を生成します。",
    wire: [
      "code_verifier = high_entropy_random(43..128 unreserved chars)",
      "// local only — not transmitted",
    ],
    action: "code_verifier を生成する",
  },
  {
    id: "challenge",
    phase: "PKCE PREP",
    from: "client",
    to: "client",
    kind: "local",
    label: "S256 → code_challenge",
    storyTitle: "秘密そのものではなく、“指紋”を作る",
    storyBody:
      "code_verifierをSHA-256で変換して code_challenge を作ります。外へ出すのはこの変換後の値です。",
    protocolTitle: "Client derives an S256 code_challenge",
    protocolBody:
      "S256では BASE64URL(SHA256(ASCII(code_verifier))) を code_challenge として使用します。",
    wire: ["code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))"],
    action: "S256 challenge を作る",
  },
  {
    id: "authorize",
    phase: "AUTHORIZATION",
    from: "client",
    to: "auth",
    kind: "request",
    label: "GET /authorize + code_challenge",
    storyTitle: "Browser / Appが、認可を始めてもらう",
    storyBody:
      "Browser / AppはAuthorization Endpointへ移動し、さきほど作った“秘密の指紋”も一緒に渡します。秘密の原本はまだ手元です。",
    protocolTitle: "Authorization Request + PKCE challenge",
    protocolBody:
      "Authorization Endpointへ response_type=code と code_challenge / S256 を含む認可要求を送ります。",
    wire: [
      "GET /authorize?response_type=code",
      "  &client_id=public-client",
      "  &redirect_uri=https://app.example/callback",
      "  &code_challenge=CHALLENGE&code_challenge_method=S256",
      "  &state=STATE",
    ],
    action: "認可要求を送る",
  },
  {
    id: "login-ui",
    phase: "AUTHENTICATION",
    from: "auth",
    to: "client",
    kind: "response",
    label: "Login / Consent UI",
    storyTitle: "認可サーバーのログイン画面がBrowserへ返る",
    storyBody:
      "ユーザーへ直接ネットワーク通信するのではなく、Authorization Serverのログイン・同意画面がBrowserへ返り、Browser上で表示されます。",
    protocolTitle: "Authorization Server returns the authentication interaction to the user-agent",
    protocolBody:
      "OAuthはユーザー認証の具体方式を規定しません。この教材では、Authorization Endpointとのブラウザ上の認証・同意インタラクションとして表します。",
    wire: [
      "HTTP/1.1 200 OK",
      "Content-Type: text/html",
      "<login / consent interaction>",
    ],
    action: "ログイン画面をBrowserへ返す",
  },
  {
    id: "user-interaction",
    phase: "AUTHENTICATION",
    from: "user",
    to: "client",
    kind: "local",
    label: "User interaction · Login / Consent",
    storyTitle: "ユーザーがBrowser上でログイン・同意を操作する",
    storyBody:
      "ユーザーはBrowserに表示されたAuthorization Serverの画面を操作します。ここは“人の操作”であり、まだBrowserからサーバーへの戻り通信とは分けて見ます。",
    protocolTitle: "Resource Owner interacts through the user-agent",
    protocolBody:
      "Resource Ownerの認証・認可操作をUser-Agent上のインタラクションとして表しています。具体的な資格情報や認証方式はこの教材では扱いません。",
    wire: ["// user interaction in the browser", "authenticate + approve requested access"],
    action: "ログイン・同意を操作する",
  },
  {
    id: "login-submit",
    phase: "AUTHENTICATION",
    from: "client",
    to: "auth",
    kind: "request",
    label: "Authentication / Consent submission",
    storyTitle: "Browserから認可サーバーへ、認証・同意の結果を返す",
    storyBody:
      "ユーザー操作の結果がBrowserからAuthorization Serverへ戻ります。ここがログイン画面の“戻りの通信”です。",
    protocolTitle: "User-agent submits the authorization-server interaction",
    protocolBody:
      "Authorization Server側で認証と認可判断を完了させるためのブラウザ通信を、代表的な往復として表示しています。OAuthはこの認証プロトコル自体を規定しません。",
    wire: [
      "POST /authorization-interaction",
      "result = authenticated + authorized",
      "// representative only; authentication method is deployment-specific",
    ],
    action: "認証・同意を送信する",
  },
  {
    id: "code-return",
    phase: "AUTHORIZATION",
    from: "auth",
    to: "client",
    kind: "redirect",
    label: "302 · Authorization Code",
    storyTitle: "一度限りの“引換券”がBrowser / Appへ戻る",
    storyBody:
      "認証と同意が完了すると、Authorization Codeが登録済みredirect_uriへ返ります。これはAccess Tokenではありません。",
    protocolTitle: "Authorization Response returns an authorization code",
    protocolBody:
      "Authorization Serverはcode_challengeとの関連を保持したAuthorization Codeをredirect_uriへ返します。",
    wire: [
      "HTTP/1.1 302 Found",
      "Location: https://app.example/callback?code=AUTH_CODE&state=STATE",
    ],
    action: "Authorization Codeを返す",
  },
  {
    id: "intercept",
    phase: "ATTACK LAB",
    from: "auth",
    to: "attacker",
    kind: "attack",
    label: "AUTH_CODE intercepted",
    storyTitle: "ここで攻撃者がAuthorization Codeだけを横取りしたら？",
    storyBody:
      "この教材ではredirectの途中でCodeだけが漏れた状況を単純化して再現します。攻撃者はcode_verifierを知りません。",
    protocolTitle: "Simulated authorization-code interception",
    protocolBody:
      "攻撃者がAUTH_CODEを取得したと仮定します。PKCEが有効な場合、Authorization Request時のcode_challengeに対応するcode_verifierは取得できていません。",
    wire: ["attacker obtains: AUTH_CODE", "attacker does NOT obtain: code_verifier"],
    action: "Codeを横取りしてみる",
  },
  {
    id: "attacker-exchange",
    phase: "ATTACK LAB",
    from: "attacker",
    to: "token",
    kind: "attack",
    label: "POST /token · stolen code",
    storyTitle: "攻撃者が、盗んだ引換券だけでToken交換を試す",
    storyBody:
      "Codeは持っています。しかしPKCEが有効なら、“秘密の原本”であるcode_verifierが足りません。",
    protocolTitle: "Attacker submits the intercepted code without the verifier",
    protocolBody:
      "Token EndpointはAuthorization Codeに結び付いたchallengeを検証するため、対応するcode_verifierを要求します。",
    wire: [
      "POST /token",
      "grant_type=authorization_code&code=AUTH_CODE",
      "// code_verifier is missing",
    ],
    action: "盗んだCodeで交換を試す",
  },
  {
    id: "attacker-result",
    phase: "ATTACK LAB",
    from: "token",
    to: "attacker",
    kind: "error",
    label: "400 · invalid_grant",
    storyTitle: "Codeは正しい。でも“秘密の原本”がないので交換できない",
    storyBody:
      "これがPKCEの狙いです。Authorization Code単体を盗めても、最初のBrowser / Appが保持するcode_verifierがないとTokenへ交換できません。",
    protocolTitle: "Token Endpoint rejects the exchange",
    protocolBody:
      "受け取ったcode_verifierがない、またはchallengeと一致しないため、Authorization Codeの交換は成立しません。",
    wire: ["HTTP/1.1 400 Bad Request", "{ \"error\": \"invalid_grant\" }"],
    action: "正規Appの交換を見る",
  },
  {
    id: "client-exchange",
    phase: "TOKEN EXCHANGE",
    from: "client",
    to: "token",
    kind: "request",
    label: "POST /token · code + verifier",
    storyTitle: "正規Appは、Codeと一緒に秘密の原本を出せる",
    storyBody:
      "Browser / Appは最初から保持していたcode_verifierを提示します。Token Endpointは“最初の依頼主と同じ”ことを確認できます。",
    protocolTitle: "Legitimate client submits code_verifier",
    protocolBody:
      "Token Endpointは受け取ったcode_verifierからchallengeを再計算し、Authorization Codeに関連付けたchallengeと照合します。",
    wire: [
      "POST /token",
      "grant_type=authorization_code&code=AUTH_CODE",
      "&redirect_uri=https://app.example/callback",
      "&code_verifier=VERIFIER",
    ],
    action: "code + verifier で交換する",
  },
  {
    id: "token-return",
    phase: "TOKEN EXCHANGE",
    from: "token",
    to: "client",
    kind: "success",
    label: "200 · Access Token",
    storyTitle: "検証に通った正規AppへAccess Tokenが戻る",
    storyBody:
      "Authorization Codeの役目はここで終わりです。Protected APIへ持っていくのは、交換で得たAccess Tokenです。",
    protocolTitle: "Token Endpoint issues an access token",
    protocolBody:
      "PKCE検証を含むToken Requestが成立し、クライアントへAccess Tokenが発行されます。",
    wire: [
      "HTTP/1.1 200 OK",
      "{ \"access_token\": \"ACCESS_TOKEN\", \"token_type\": \"Bearer\" }",
    ],
    action: "Access Tokenを受け取る",
  },
  {
    id: "api-request",
    phase: "RESOURCE ACCESS",
    from: "client",
    to: "api",
    kind: "request",
    label: "GET /resource · Bearer token",
    storyTitle: "Access Tokenを持ってProtected APIへアクセスする",
    storyBody:
      "ここで初めてAPIへ進みます。Authorization Codeではなく、Access Tokenを提示します。",
    protocolTitle: "Client calls the Resource Server with the access token",
    protocolBody:
      "Resource RequestのAuthorization headerにBearer Access Tokenを設定します。Resource ServerはTokenを検証してアクセスを判断します。",
    wire: ["GET /resource", "Authorization: Bearer ACCESS_TOKEN"],
    action: "Protected APIを呼ぶ",
  },
  {
    id: "api-response",
    phase: "RESOURCE ACCESS",
    from: "api",
    to: "client",
    kind: "success",
    label: "200 · protected resource",
    storyTitle: "APIのレスポンスが正規Appへ戻る",
    storyBody:
      "往路だけでなく、レスポンスまで戻ってPKCEの一連の流れが完了します。Codeを守る仕組みと、APIへ使うTokenの役割は別です。",
    protocolTitle: "Resource Server returns the protected resource",
    protocolBody:
      "Resource ServerがAccess Tokenを有効と判断し、要求された保護リソースをクライアントへ返します。",
    wire: ["HTTP/1.1 200 OK", "{ \"resource\": \"protected data\" }"],
    action: "最初からもう一度見る",
  },
] as const;

const skippedEvent = (event: SequenceEvent, reason: string): SequenceEvent => ({
  ...event,
  kind: "skipped",
  label: `SKIP · ${event.label}`,
  storyTitle: "PKCE OFFでは、この工程そのものがありません",
  storyBody: reason,
  protocolTitle: "PKCE step intentionally omitted",
  protocolBody:
    "これは比較用の意図的に危険なシミュレーションです。現在のOAuth Security BCPではPublic ClientにPKCEが要求されます。",
  wire: ["// intentionally omitted in insecure comparison"],
  action: "スキップして次へ",
  skipped: true,
});

export const buildSequence = (mode: FlowMode): readonly SequenceEvent[] => {
  if (mode === "safe") return safeEvents;

  return safeEvents.map((event): SequenceEvent => {
    if (event.id === "verifier") {
      return skippedEvent(event, "code_verifierを作らないため、後のCode交換を元のClientへ結び付けられません。");
    }
    if (event.id === "challenge") {
      return skippedEvent(event, "code_challengeもAuthorization Requestへ送りません。");
    }
    if (event.id === "authorize") {
      return {
        ...event,
        label: "GET /authorize · NO PKCE",
        storyTitle: "比較のため、PKCEなしで認可を開始する",
        storyBody:
          "この危険な比較ではcode_challengeを送らずにAuthorization Codeを発行させたものとして流れを続けます。",
        protocolTitle: "Authorization Request without PKCE (insecure experiment)",
        protocolBody:
          "比較用にcode_challenge / code_challenge_methodを省略しています。推奨実装ではありません。",
        wire: [
          "GET /authorize?response_type=code",
          "  &client_id=public-client",
          "  &redirect_uri=https://app.example/callback",
          "  &state=STATE",
          "// code_challenge intentionally omitted",
        ],
      };
    }
    if (event.id === "intercept") {
      return {
        ...event,
        storyBody:
          "Authorization Codeを横取りした攻撃者を再現します。今回はPKCEを外しているため、交換を元のClientへ結び付ける秘密がありません。",
        protocolBody:
          "攻撃者がAUTH_CODEを取得したと仮定します。この比較ではAuthorization CodeにPKCE challengeが関連付いていません。",
        wire: ["attacker obtains: AUTH_CODE", "PKCE binding: none (intentional experiment)"],
      };
    }
    if (event.id === "attacker-exchange") {
      return {
        ...event,
        storyBody:
          "PKCEを外した比較では、攻撃者はcode_verifierを求められない想定です。盗んだCodeだけで交換を先取りします。",
        protocolTitle: "Attacker submits the intercepted code without PKCE",
        protocolBody:
          "この単純化した比較ではPKCE bindingがないAuthorization Codeを攻撃者が先にToken Endpointへ提示します。",
        wire: [
          "POST /token",
          "grant_type=authorization_code&code=AUTH_CODE",
          "// no PKCE verifier required in this experiment",
        ],
      };
    }
    if (event.id === "attacker-result") {
      return {
        ...event,
        kind: "success",
        label: "200 · stolen Access Token",
        storyTitle: "PKCEがない比較では、攻撃者がToken交換に成功する",
        storyBody:
          "これがON/OFFで見比べたい差です。Codeを盗んだ主体をToken Endpointが元のClientと区別できません。",
        protocolTitle: "Insecure comparison: attacker receives an access token",
        protocolBody:
          "PKCEを意図的に無効化した教材上の比較結果です。実システムへの攻撃手順を示すものではありません。",
        wire: [
          "HTTP/1.1 200 OK",
          "{ \"access_token\": \"STOLEN_ACCESS_TOKEN\" }",
          "// intentionally insecure simulation",
        ],
        action: "攻撃者のAPIアクセスを見る",
      };
    }
    if (event.id === "client-exchange" || event.id === "token-return") {
      return skippedEvent(
        event,
        "この単純化した比較では、攻撃者がAuthorization Codeを先に交換したため正規Client側の交換は省略します。",
      );
    }
    if (event.id === "api-request") {
      return {
        ...event,
        from: "attacker",
        label: "GET /resource · stolen token",
        storyTitle: "盗んだCodeから得たTokenで、攻撃者がAPIへ進む",
        storyBody:
          "比較用の危険な状態です。PKCEがない場合に、Code interceptionの影響がToken取得からResource Accessへつながることを見せます。",
        protocolTitle: "Simulated attacker calls the Resource Server",
        protocolBody:
          "PKCEを意図的に無効化した教材上の比較として、攻撃者が取得したAccess TokenをResource Requestへ使用します。",
        wire: ["GET /resource", "Authorization: Bearer STOLEN_ACCESS_TOKEN"],
        action: "攻撃者がProtected APIを呼ぶ",
      };
    }
    if (event.id === "api-response") {
      return {
        ...event,
        to: "attacker",
        kind: "success",
        label: "200 · resource leaked (experiment)",
        storyTitle: "危険な比較では、APIレスポンスまで攻撃者へ戻る",
        storyBody:
          "PKCE OFFの比較はここまでです。実際の設計ではこの状態を許容せず、PKCEを有効にしてAuthorization Codeの交換を元のClientへ結び付けます。",
        protocolTitle: "Insecure experiment completes",
        protocolBody:
          "Resource Serverが提示されたTokenを有効と判断したという単純化した教材結果です。",
        wire: [
          "HTTP/1.1 200 OK",
          "{ \"resource\": \"protected data\" }",
          "// intentionally insecure simulation",
        ],
        action: "最初から比較する",
      };
    }
    return event;
  });
};

export const nextStepIndex = (events: readonly SequenceEvent[], index: number): number => {
  for (let offset = 1; offset <= events.length; offset += 1) {
    const candidate = (index + offset) % events.length;
    if (!events[candidate]?.skipped) return candidate;
  }
  return index;
};

export const previousStepIndex = (events: readonly SequenceEvent[], index: number): number => {
  for (let offset = 1; offset <= events.length; offset += 1) {
    const candidate = (index - offset + events.length) % events.length;
    if (!events[candidate]?.skipped) return candidate;
  }
  return index;
};
