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
  { name: "desktop-code-return-1440", step: "Step 7: Code" },
  { name: "desktop-token-return-1440", step: "Step 10: Token" },
  { name: "desktop-api-response-1440", step: "Step 12: Response" },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch();

try {
  for (const view of views) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
      reducedMotion: "reduce",
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
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
    await desktop.screenshot({
      path: `${output}/${state.name}.png`,
      fullPage: true,
    });
  }
  await desktop.close();
} finally {
  await browser.close();
}
