import { chromium } from "playwright-core";
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(3800);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(name, "scrollWidth", sw);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  if (mobile) {
    await page.locator(".hero__card .btn--primary").click();
    await page.waitForTimeout(700);
    await page.locator(".apply button[type=submit]").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/mobile-apply.png` });
  }
  await ctx.close();
}
await browser.close();
