import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["desktop1280", { width: 1280, height: 800 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  if (mobile) await page.evaluate(() => window.scrollTo(0, 520));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `.impeccable/review/portal/${name}-top.png` });
  await ctx.close();
}
await browser.close();
