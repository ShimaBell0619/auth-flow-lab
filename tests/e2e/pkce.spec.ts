import { expect, test } from "@playwright/test";

test("renders one white animated protocol stage without the old inspector controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Story" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Break it/ })).toHaveCount(0);
  await expect(page.getByLabel("選択中の通信の説明")).toHaveCount(0);

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(255, 255, 255)");
});

test("timeline selection shows the chosen event in the stage and leaves completed trails", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Step 7: Code" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-step", "code-return");
  await expect(page.getByTestId("flow-bubble")).toContainText("Authorization Code を返す");
  await expect(page.getByTestId("flow-bubble")).toContainText("302 · AUTH_CODE");
  expect(await page.getByTestId("completed-trail").count()).toBe(6);
});

test("full-motion mode contains an SVG packet motion for the active route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 8: Token Req" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-motion", "full");
  await expect(page.getByTestId("active-packet")).toBeVisible();
  await expect(page.locator("animateMotion")).toHaveCount(2);
});

test("reduced-motion mode preserves the current route without packet travel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Step 10: Token" }).click();

  const stage = page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" });
  await expect(stage).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByTestId("active-packet-static")).toBeVisible();
  await expect(page.locator("animateMotion")).toHaveCount(0);
  await expect(page.getByTestId("flow-bubble")).toContainText("Access Token を発行");
});

test("timeline steps are keyboard reachable in a logical sequence", async ({ page }) => {
  await page.goto("/");

  const first = page.getByRole("button", { name: "Step 1: Verifier" });
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Step 2: Challenge" })).toBeFocused();
});

test("narrow layouts keep the wide stage inside its own scroll surface", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("region", { name: "Authorization Code + PKCE 通信ステージ" })).toBeVisible();
});
