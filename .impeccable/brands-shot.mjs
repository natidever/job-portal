import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  await page.locator(".brands").scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
  await page.locator(".brands").screenshot({ path: `.impeccable/review/portal/${name}-brands.png` });
  await page.waitForTimeout(2500);
  await page.locator(".brands").screenshot({ path: `.impeccable/review/portal/${name}-brands-2.png` });
  await ctx.close();
}
await browser.close();
