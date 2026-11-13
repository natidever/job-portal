import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  console.log(name, "scrollWidth", await page.evaluate(() => document.documentElement.scrollWidth));
  for (const sel of ["#featured", ".promo"]) {
    await page.locator(sel).scrollIntoViewIfNeeded(); await page.waitForTimeout(2200);
    await page.locator(sel).screenshot({ path: `.impeccable/review/portal/${name}-${sel.replace(/[#.]/, "")}.png` });
  }
  if (!mobile) {
    await page.locator(".fcard__save").first().click();
    await page.locator(".feat__arrow").nth(1).click(); await page.waitForTimeout(900);
    await page.locator("#featured").screenshot({ path: `.impeccable/review/portal/desktop-featured-next.png` });
  }
  await ctx.close();
}
await browser.close();
