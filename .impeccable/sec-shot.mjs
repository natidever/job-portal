import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
for (const id of ["sectors", "employers"]) {
  await page.locator("#" + id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  if (id === "sectors") { await page.locator(".dir__row").nth(0).hover(); await page.waitForTimeout(900); }
  await page.locator("#" + id).screenshot({ path: `.impeccable/review/portal/desktop-${id}.png` });
}
await page.locator("#vacancies").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.locator(".pane").screenshot({ path: `.impeccable/review/portal/desktop-pane.png` });
await browser.close();
