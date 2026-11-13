import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    await Promise.all([...document.images].filter(i => i.getClientRects().length).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  for (const id of ["stats", "stories"]) {
    const sel = id === "stats" ? ".stats" : "#stories";
    await page.locator(sel).scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
    await page.locator(sel).screenshot({ path: `.impeccable/review/portal/${name}-${id}.png` });
  }
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:3100/jobs?sector=Finance", { waitUntil: "networkidle", timeout: 120000 });
await p.screenshot({ path: `.impeccable/review/portal/jobs-holding.png` });
await browser.close();
