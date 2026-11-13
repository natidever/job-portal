import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const out = ".impeccable/review/portal";
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3100/jobs", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1200);
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  await page.screenshot({ path: `${out}/jobs-${name}-top.png` });
  await page.screenshot({ path: `${out}/jobs-${name}-full.png`, fullPage: true });
  await page.locator(".jrow__more").first().click();
  await page.locator(".jrow__icon").nth(1).click();
  await page.waitForTimeout(300);
  await page.locator(".jrow").first().screenshot({ path: `${out}/jobs-${name}-row-open.png` });
  if (mobile) {
    await page.locator(".jlist__filters").click(); await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/jobs-${name}-filters.png` });
    await page.keyboard.press("Escape"); await page.waitForTimeout(300);
  }
  await page.locator(".jrow__view").first().click(); await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/jobs-${name}-drawer.png` });
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:3100/jobs?sector=Engineering", { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/jobs-desktop-sector.png` });
await browser.close();
