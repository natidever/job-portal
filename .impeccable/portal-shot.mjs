import { chromium } from "playwright-core";
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  await page.screenshot({ path: `${out}/${name}-top.png` });
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  // Interaction: pick a sector, then open a job.
  await page.locator(".dir__row").nth(2).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${name}-board.png` });
  await page.locator(".row__hit").first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}-detail.png` });
  await ctx.close();
}
await browser.close();
