import { expect, test } from "@playwright/test";

test("starts from user intent and shows system boundaries on a white stage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 1: Start" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute("data-step", "initiate");
  await expect(page.getByTestId("flow-bubble")).toContainText("サインインを開始");
  await expect(page.getByTestId("active-route")).toHaveAttribute("data-from", "user");
  await expect(page.getByTestId("active-route")).toHaveAttribute("data-to", "client");
  await expect(page.getByTestId("system-boundary")).toHaveCount(3);
  await expect(page.getByText("CLIENT DEVICE", { exact: true })).toBeVisible();
  await expect(page.getByText("AUTHORIZATION SERVER", { exact: true })).toBeVisible();
  await expect(page.getByText("RESOURCE SERVER", { exact: true })).toBeVisible();

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const stageBackground = await stage.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.backgroundColor, image: style.backgroundImage };
  });

  expect(background).toBe("rgb(255, 255, 255)");
  expect(stageBackground.color).toBe("rgb(255, 255, 255)");
  expect(stageBackground.image).toBe("none");
});

test("old inspector controls stay absent", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Story" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Break it/ })).toHaveCount(0);
  await expect(page.getByLabel("選択中の通信の説明")).toHaveCount(0);
});

test("timeline selection shows the chosen event in the stage and leaves completed trails", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Step 8: Code" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-step", "code-return");
  await expect(page.getByTestId("flow-bubble")).toContainText("Authorization Code を返す");
  await expect(page.getByTestId("flow-bubble")).toContainText("302 · AUTH_CODE");
  expect(await page.getByTestId("completed-trail").count()).toBe(7);
});

test("retained verifier and code challenge association stay visible across dependent steps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("button", { name: "Step 2: Verifier" }).click();
  await expect(page.getByTestId("state-cue-client")).toContainText("保持中");
  await expect(page.getByTestId("state-cue-client")).toContainText("code_verifier · vfy_demo_7K2");

  await page.getByRole("button", { name: "Step 4: Authorize" }).click();
  await expect(page.getByTestId("state-cue-auth")).toContainText("受信済み");
  await expect(page.getByTestId("state-cue-auth")).toContainText("code_challenge · chl_demo_Q9P");
  await expect(page.getByTestId("state-cue-auth")).not.toContainText("AUTH_CODE");

  await page.getByRole("button", { name: "Step 8: Code" }).click();
  await expect(page.getByTestId("state-cue-auth")).toContainText("Codeと関連");
  await expect(page.getByTestId("state-cue-auth")).toContainText("AUTH_CODE ↔ chl_demo_Q9P");

  await page.getByRole("button", { name: "Step 10: Verify" }).click();
  await expect(page.getByTestId("verification-cue")).toContainText("S256(received verifier) → chl_demo_Q9P");
  await expect(page.getByTestId("verification-cue")).toContainText("AUTH_CODE ↔ chl_demo_Q9P");
  await expect(page.getByTestId("verification-cue")).toContainText("一致");
  await expect(page.getByTestId("pkce-state-summary")).toContainText("Authorization Code に関連付けられた code_challenge");
});

test("browser location cue distinguishes app, authorization UI, and callback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("button", { name: "Step 1: Start" }).click();
  await expect(page.getByTestId("browser-location-cue")).toContainText("app.example.test/");

  await page.getByRole("button", { name: "Step 5: Login UI" }).click();
  await expect(page.getByTestId("browser-location-cue")).toContainText("auth.example.test/authorize");
  await expect(page.getByTestId("browser-location-cue")).toHaveAttribute("aria-label", /Authorization Server/);

  await page.getByRole("button", { name: "Step 8: Code" }).click();
  await expect(page.getByTestId("browser-location-cue")).toContainText("→ app.example.test/callback");

  await page.getByRole("button", { name: "Step 9: Token Req" }).click();
  await expect(page.getByTestId("browser-location-cue")).toContainText("app.example.test/callback");
  await expect(page.getByTestId("browser-location-cue")).toContainText("架空URL例");
});

test("initial auto-play keeps scheduling beyond the first transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-step", "initiate");
  await expect(stage).toHaveAttribute("data-step", "verifier", { timeout: 3000 });
  await expect(stage).toHaveAttribute("data-step", "challenge", { timeout: 3000 });
});

test("playback controls pause, resume from a selected step, and restart", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await page.getByRole("button", { name: "一時停止" }).click();
  await expect(stage).toHaveAttribute("data-step", "initiate");
  await page.waitForTimeout(2400);
  await expect(stage).toHaveAttribute("data-step", "initiate");

  await page.getByRole("button", { name: "Step 9: Token Req" }).click();
  await expect(page.getByText("TOKEN EXCHANGE", { exact: true })).toBeVisible();
  await expect(page.getByText("9 / 13", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "再生", exact: true }).click();
  await expect(stage).toHaveAttribute("data-step", "verifier-check", { timeout: 3000 });

  await page.getByRole("button", { name: "最初から", exact: true }).click();
  await expect(stage).toHaveAttribute("data-step", "initiate");
  await expect(page.getByText("SCENARIO START", { exact: true })).toBeVisible();
  await expect(page.getByText("1 / 13", { exact: true })).toBeVisible();
});

test("replay restarts the current packet and speed changes packet duration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 9: Token Req" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  const beforeReplay = Number(await stage.getAttribute("data-replay-key"));
  await page.getByRole("button", { name: "この場面を再生" }).click();
  await expect(stage).toHaveAttribute("data-replay-key", String(beforeReplay + 1));

  await page.getByLabel("再生速度").selectOption("1.5");
  await expect(stage).toHaveAttribute("data-playback-rate", "1.5");
  await expect(page.locator("animateMotion").first()).toHaveAttribute("dur", "1267ms");
});

test("full-motion mode contains an SVG packet motion for the active route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 9: Token Req" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-motion", "full");
  await expect(page.getByTestId("active-packet")).toBeVisible();
  await expect(page.locator("animateMotion")).toHaveCount(2);
});

test("reduced-motion mode preserves the selected route without packet travel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 11: Token" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  const activeRoute = page.getByTestId("active-route");
  await expect(stage).toHaveAttribute("data-motion", "reduced");
  await expect(activeRoute).toHaveAttribute("data-from", "token");
  await expect(activeRoute).toHaveAttribute("data-to", "client");
  await expect(activeRoute).toHaveClass(/tone-success/);
  await expect(page.getByTestId("active-packet-static")).toBeVisible();
  await expect(page.locator("animateMotion")).toHaveCount(0);
  await expect(page.getByTestId("flow-bubble")).toContainText("Access Token を発行");
});

test("final response shows a compact recap and can restart the lesson", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 13: Response" }).click();

  const recap = page.getByTestId("completion-recap");
  await expect(recap).toBeVisible();
  await expect(recap).toContainText("verifier は /authorize に送らず");
  await expect(recap).toContainText("Authorization Code はToken交換");
  await expect(recap).toContainText("verifier の照合は /token");

  await page.getByRole("button", { name: "最初からもう一度" }).click();
  await expect(page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" })).toHaveAttribute(
    "data-step",
    "initiate",
  );
  await expect(recap).toHaveCount(0);
});

test("timeline steps are keyboard reachable in a logical sequence", async ({ page }) => {
  await page.goto("/");

  const first = page.getByRole("button", { name: "Step 1: Start" });
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Step 2: Verifier" })).toBeFocused();
});

test("supporting labels are readable at the rendered baseline", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Step 1: Start" }).click();

  const boundaryFontSize = await page.getByText("CLIENT DEVICE", { exact: true }).evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  const timelineFontSize = await page.getByText("Start", { exact: true }).evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );

  expect(boundaryFontSize).toBeGreaterThanOrEqual(12);
  expect(timelineFontSize).toBeGreaterThanOrEqual(12);
});

test("narrow layout can return to the active communication without forced auto-follow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 12: API" }).click();

  const stageScroll = page.getByTestId("stage-scroll");
  expect(await stageScroll.evaluate((element) => element.scrollLeft)).toBe(0);
  await page.getByRole("button", { name: "現在の通信へ" }).click();
  expect(await stageScroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(200);
});

test("narrow layouts keep PKCE state cues inside the contained stage", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 10: Verify" }).click();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" })).toBeVisible();
  await expect(page.getByRole("region", { name: "レッスン再生操作" })).toBeVisible();
  await expect(page.getByTestId("verification-cue")).toBeVisible();
  await expect(page.getByTestId("browser-location-cue")).toBeVisible();
});
