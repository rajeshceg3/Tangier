import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
let browser, server;
const out = process.env.OUT || "verification/gate";
fs.mkdirSync(out, { recursive: true });
let results = [];
try {
  let url = process.env.BASE_URL || "http://127.0.0.1:8795";
  if (!process.env.BASE_URL) {
    server = spawn(
      "python3",
      ["-m", "http.server", "8795", "--directory", "dist"],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 40; i++) {
      try {
        if ((await fetch(url)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  for (const w of JSON.parse(process.env.WIDTHS || "[390,1440]"))
    for (const motion of JSON.parse(
      process.env.MOTIONS || '["reduce","no-preference"]',
    )) {
      const p = await browser.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(String(e)));
      await p.setViewport({ width: w, height: 844 });
      await p.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: motion },
      ]);
      // pin-first: pin lands before the app boots, chrome stays up for the drive
      await p.evaluateOnNewDocument(() => {
        try {
          localStorage.setItem("tangier-chrome-pin", "1");
        } catch {}
      });
      await p.goto(url);
      await p.waitForFunction(
        () => document.querySelector("canvas")?.dataset.yaw,
      );
      await p.evaluate(() => document.fonts.ready);
      assert.equal(
        await p.$eval("#pin-controls", (e) => e.getAttribute("aria-pressed")),
        "true",
      );
      assert.ok(
        await p.$eval(
          "#sound",
          (e) => getComputedStyle(e).visibility === "visible",
        ),
        "pinned chrome stays visible",
      );
      if (motion === "no-preference") await p.click("#pause");
      if (process.env.PINNED !== "0") {
      for (let ch = 0; ch < 4; ch++) {
        await p.click(`nav [data-chapter="${ch}"]`);
        await new Promise((r) => setTimeout(r, 300));
        await p.mouse.move(w * 0.8, 240);
        await p.mouse.down();
        await p.mouse.move(w * 0.2, 310, { steps: 3 });
        await p.mouse.up();
        await p.click("#reset");
        await new Promise((r) => setTimeout(r, 350));
        const s = await p.evaluate(() => {
          let c = document.querySelector("canvas");
          return {
            yaw: +c.dataset.yaw,
            pitch: +c.dataset.pitch,
            ey: +c.dataset.entryYaw,
            ep: +c.dataset.entryPitch,
            ch: +document.body.dataset.chapter,
            overflow: document.documentElement.scrollWidth > innerWidth,
            sound: document
              .querySelector("#sound")
              .getAttribute("aria-pressed"),
            buttons: [...document.querySelectorAll("button")]
              .filter((e) => e.getBoundingClientRect().width)
              .map((e) => [
                e.getBoundingClientRect().width,
                e.getBoundingClientRect().height,
              ]),
            labels: [
              ...document.querySelectorAll(
                "nav button,#line,.eyebrow,#compass",
              ),
            ].map((e) => parseFloat(getComputedStyle(e).fontSize)),
          };
        });
        assert.equal(s.ch, ch);
        assert.ok(
          Math.abs(s.yaw - s.ey) < 0.001 && Math.abs(s.pitch - s.ep) < 0.001,
        );
        assert.equal(s.sound, "false");
        assert.equal(s.overflow, false);
        assert.ok(s.buttons.every((t) => t[0] >= 44 && t[1] >= 44));
        assert.ok(s.labels.every((x) => x >= 16));
        await p.screenshot({ path: `${out}/${w}-${motion}-${ch}.png` });
        results.push({
          width: w,
          motion,
          ch,
          resetHeld: true,
          audioOff: true,
          targetFloor: true,
          labelFloor: true,
        });
      }
      await p.click("#about");
      assert.equal(await p.$eval("dialog", (e) => e.open), true);
      await p.keyboard.press("Escape");
      assert.equal(await p.$eval("dialog", (e) => e.open), false);
      assert.deepEqual(errors, []);
      }
      await p.close();
      // quiet-by-default pass: no pin, chrome greets then retires, the lantern remains
      if (process.env.QUIET !== "0") {
        const q = await browser.newPage();
        const qerrors = [];
        q.on("pageerror", (e) => qerrors.push(String(e)));
        await q.setViewport({ width: w, height: 844 });
        await q.emulateMediaFeatures([
          { name: "prefers-reduced-motion", value: motion },
        ]);
        await q.evaluateOnNewDocument(() => {
          try {
            localStorage.removeItem("tangier-chrome-pin");
          } catch {}
        });
        await q.goto(url);
        await q.waitForFunction(
          () => document.querySelector("canvas")?.dataset.yaw,
        );
        await new Promise((r) => setTimeout(r, 3400));
        assert.ok(
          await q.$(".chrome-hint"),
          "chrome retired and the lantern hint is showing",
        );
        assert.ok(
          await q.$eval(
            "#sound",
            (e) => getComputedStyle(e).visibility === "hidden",
          ),
          "toolbar retired",
        );
        assert.ok(
          await q.$eval(
            ".story",
            (e) => getComputedStyle(e).visibility === "visible",
          ),
          "story card never retires",
        );
        const hb = await q.$eval(".chrome-hint", (e) => {
          const r = e.getBoundingClientRect();
          return { w: r.width, h: r.height };
        });
        assert.ok(hb.w >= 44 && hb.h >= 44, "hint keeps a 44px hit area");
        await q.screenshot({ path: `${out}/${w}-${motion}-quiet.png` });
        await q.click(".chrome-hint");
        await new Promise((r) => setTimeout(r, 400));
        assert.ok(
          await q.$eval(
            "#sound",
            (e) => getComputedStyle(e).visibility === "visible",
          ),
          "hint woke the controls",
        );
        await q.screenshot({ path: `${out}/${w}-${motion}-woken.png` });
        await q.keyboard.press("Escape");
        await new Promise((r) => setTimeout(r, 400));
        assert.ok(
          await q.$eval(
            "#sound",
            (e) => getComputedStyle(e).visibility === "hidden",
          ),
          "Escape retired the controls",
        );
        assert.deepEqual(qerrors, []);
        await q.close();
      }
      fs.writeFileSync(out + "/results.json", JSON.stringify(results, null, 2));
      console.log("PASS", w, motion);
    }
} finally {
  await browser?.close();
  server?.kill();
}
