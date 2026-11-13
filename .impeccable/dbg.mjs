import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage();
await p.goto("http://localhost:3100/", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > 392).slice(0, 15).map(e => e.tagName + "." + e.className + " " + Math.round(e.getBoundingClientRect().right))));
await b.close();
