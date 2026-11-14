import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  await page.locator("#stories").scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
  await page.locator("#stories").screenshot({ path: `.impeccable/review/portal/${name}-stories.png` });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
