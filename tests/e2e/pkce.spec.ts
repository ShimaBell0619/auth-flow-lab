import { expect, test, type Page } from "@playwright/test";

const advanceSafeFlowToExchange = async (page: Page) => {
  await page.getByRole("button", { name: "秘密を生成する" }).click();
  await page.getByRole("button", { name: "code_challenge を送る" }).click();
  await page.getByRole("button", { name: "ログインして認可コードを受け取る" }).click();
  await page.getByRole("button", { name: "攻撃者に交換させてみる" }).click();
};

test("PKCE blocks the simulated intercepted-code exchange", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("推奨フロー · PKCE ON")).toBeVisible();
  await advanceSafeFlowToExchange(page);
  await expect(page.getByText("攻撃失敗", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Protocol" }).click();
  await expect(page.getByText("400 invalid_grant · verifier missing/mismatch", { exact: true })).toBeVisible();
});

test("Break it skips PKCE-only steps and shows the insecure comparison", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Break it/ }).click();

  await expect(page.getByText("実験モード · PKCE OFF")).toBeVisible();
  await expect(page.getByRole("button", { name: /Secret · SKIP/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Challenge · SKIP/ })).toBeDisabled();

  await page.getByRole("button", { name: "ログインして認可コードを受け取る" }).click();
  await page.getByRole("button", { name: "攻撃者に交換させてみる" }).click();
  await expect(page.getByText("攻撃成功（実験）", { exact: true })).toBeVisible();
});

test("core controls are reachable in a logical keyboard order", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Story" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Protocol" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /Break it/ })).toBeFocused();
});

test("the 320px layout does not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
