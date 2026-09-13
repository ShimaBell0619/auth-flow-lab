import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.UI_REVIEW_BASE_URL ?? "http://127.0.0.1:4173";
const output = process.env.UI_REVIEW_OUTPUT ?? "/tmp/auth-flow-lab-ui-review";

const views = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "narrow-320", width: 320, height: 800 },
];

const desktopStates = [
  { name: "desktop-verifier-1440", step: "Step 2: Verifier" },
  { name: "desktop-code-return-1440", step: "Step 8: Code" },
  { name: "desktop-token-return-1440", step: "Step 11: Token" },
  { name: "desktop-api-response-1440", step: "Step 13: Response" },
];

const experimentViews = [
  { name: "desktop-verifier-mismatch-1440", width: 1440, height: 900 },
  { name: "mobile-verifier-mismatch-390", width: 390, height: 844 },
  { name: "narrow-verifier-mismatch-320", width: 320, height: 800 },
];

const enterMismatchExperiment = async (page) => {
  await page.getByRole("button", { name: "Step 13: Response" }).click();
  await page.getByRole("button", { name: "verifierを変えて試す" }).click();
  await page.getByRole("button", { name: /不一致 verifier/ }).click();
  await page.getByRole("button", { name: "送って照合する" }).click();
  await page.waitForTimeout(200);
};

await mkdir(output, { recursive: true });
const browser = await chromium.launch();

try {
  for (const view of views) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
      reducedMotion: "reduce",
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Step 1: Start" }).click();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: `${output}/${view.name}.png`,
      fullPage: true,
    });
    await page.close();
  }

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await desktop.goto(baseURL, { waitUntil: "networkidle" });
  for (const state of desktopStates) {
    await desktop.getByRole("button", { name: state.step }).click();
    await desktop.waitForTimeout(250);
    await desktop.screenshot({
      path: `${output}/${state.name}.png`,
      fullPage: true,
    });
  }
  await desktop.close();

  for (const view of experimentViews) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
      reducedMotion: "reduce",
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await enterMismatchExperiment(page);
    await page.screenshot({
      path: `${output}/${view.name}.png`,
      fullPage: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
