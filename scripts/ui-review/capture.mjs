import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.UI_REVIEW_BASE_URL ?? "http://127.0.0.1:4173";
const output = process.env.UI_REVIEW_OUTPUT ?? "/tmp/auth-flow-lab-ui-review";

const views = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "narrow-320", width: 320, height: 800 },
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
} finally {
  await browser.close();
}
