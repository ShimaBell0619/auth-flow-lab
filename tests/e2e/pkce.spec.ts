import { expect, test, type Page } from "@playwright/test";

const advanceSafeFlowToAttackerResult = async (page: Page) => {
  for (const name of [
    "code_verifier を生成する",
    "S256 challenge を作る",
    "認可要求を送る",
    "ログイン画面を返す",
    "認証・同意する",
    "Authorization Codeを返す",
    "Codeを横取りしてみる",
    "盗んだCodeで交換を試す",
  ]) {
    await page.getByRole("button", { name }).click();
  }
};

test("Story, Protocol, and Wire deepen the same selected message", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("WIRE MESSAGE · REPRESENTATIVE")).toBeHidden();
  await page.getByRole("button", { name: "Protocol" }).click();
  await expect(page.getByRole("heading", { name: "Client creates a code_verifier" })).toBeVisible();
  await page.getByRole("button", { name: "Wire" }).click();
  await expect(page.getByText("WIRE MESSAGE · REPRESENTATIVE")).toBeVisible();
  await expect(page.getByText(/high_entropy_random/)).toBeVisible();
});

test("safe sequence shows the intercepted-code rejection and return traffic", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("推奨フロー · PKCE ON")).toBeVisible();
  await expect(page.getByRole("button", { name: /302 · Authorization Code/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /200 · protected resource/ })).toBeVisible();

  await advanceSafeFlowToAttackerResult(page);
  await expect(page.getByText("400 · invalid_grant", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Wire" }).click();
  await expect(page.getByText(/400 Bad Request/)).toBeVisible();
});

test("Break it keeps the same diagram but skips PKCE-only rows and routes the token to the attacker", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Break it/ }).click();

  await expect(page.getByText("実験モード · PKCE OFF")).toBeVisible();
  await expect(page.getByRole("button", { name: /SKIP · code_verifier/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /SKIP · S256/ })).toBeVisible();

  await page.getByRole("button", { name: "Authorization Request · NO PKCE" }).click();
  for (const name of [
    "認可要求を送る",
    "ログイン画面を返す",
    "認証・同意する",
    "Authorization Codeを返す",
    "Codeを横取りしてみる",
    "盗んだCodeで交換を試す",
  ]) {
    await page.getByRole("button", { name }).click();
  }

  await expect(page.getByText("200 · stolen Access Token", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "攻撃者のAPIアクセスを見る" }).click();
  await expect(page.getByText("GET /resource · stolen token", { exact: true })).toBeVisible();
});

test("core controls are reachable in a logical keyboard order", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Story" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Protocol" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Wire" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /Break it/ })).toBeFocused();
});

test("narrow layout contains the wide sequence inside its own scroll surface", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("region", { name: "PKCE通信シーケンス" })).toBeVisible();
});
