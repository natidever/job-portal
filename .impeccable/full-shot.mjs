import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    await Promise.all([...document.images].filter(i => i.getClientRects().length).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => [...document.images].map(i => `${i.currentSrc.split("/").pop().slice(0,50)} ${i.complete} ${i.naturalWidth}x${Math.round(i.getBoundingClientRect().height)}`));
  console.log(name, info.join(" | "));
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
