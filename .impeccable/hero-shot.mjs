import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const [n, vp, m] of [["hero-desktop", { width: 1440, height: 900 }, false], ["hero-mobile", { width: 390, height: 844 }, true]]) {
  const c = await b.newContext({ viewport: vp, deviceScaleFactor: m ? 2 : 1, isMobile: m, hasTouch: m });
  const p = await c.newPage();
  const errs = [];
  p.on("console", (msg) => msg.type() === "error" && errs.push(msg.text()));
  await p.goto("http://localhost:3100/", { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `.impeccable/review/${n}.png` });
  console.log(n, "sw", await p.evaluate(() => document.documentElement.scrollWidth), errs.slice(0, 3));
  await c.close();
}
await b.close();
