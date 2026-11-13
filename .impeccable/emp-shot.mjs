import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/#employers", { waitUntil: "networkidle", timeout: 120000 });
  await page.locator("#employers").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const img = document.querySelector(".employers__photo img");
    const t = document.querySelector("#employers-title");
    return { img: img && { complete: img.complete, nw: img.naturalWidth, src: img.currentSrc.slice(0, 80), h: img.getBoundingClientRect().height }, titleW: t.scrollWidth, titleCW: t.clientWidth, fs: getComputedStyle(t).fontSize };
  });
  console.log(name, JSON.stringify(info));
  await page.locator("#employers").screenshot({ path: `.impeccable/review/portal/${name}-employers.png` });
  await ctx.close();
}
await browser.close();
