import { expect, test, type Page } from "@playwright/test";

const advanceToExchange = async (page: Page) => {
  await page.getByRole("button", { name: "秘密を生成する" }).click();
  await page.getByRole("button", { name: "code_challenge を送る" }).click();
  await page.getByRole("button", { name: "ログインして認可コードを受け取る" }).click();
  await page.getByRole("button", { name: "攻撃者に交換させてみる" }).click();
};

test("PKCE blocks the simulated intercepted-code exchange", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("推奨フロー · PKCE ON")).toBeVisible();
  await advanceToExchange(page);
  await expect(page.getByText("攻撃失敗", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Protocol" }).click();
  await expect(page.getByText(/invalid_grant/)).toBeVisible();
});

test("Break it clearly shows the intentionally insecure comparison", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Break it/ }).click();

  await expect(page.getByText("実験モード · PKCE OFF")).toBeVisible();
  await advanceToExchange(page);
  await expect(page.getByText("攻撃成功（実験）", { exact: true })).toBeVisible();
});

test("the 320px layout does not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
