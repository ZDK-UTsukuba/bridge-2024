import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const base = process.env.SEARCH_BASE_URL || "http://127.0.0.1:4322";
    await page.goto(base + "/search/");
    const input = page.locator("#searchInput");
    const visible = page.locator("[data-search-id]:visible");
    await page.waitForFunction(() =>
      document.querySelector("[data-search-status]").textContent.includes("68"),
    );
    assert.equal(await visible.count(), 68);
    const robots = page.locator('head meta[name="robots"]');
    assert.equal(await robots.count(), 0);
    assert.equal(await page.locator("[data-search-more]").count(), 0);
    assert.equal(await page.locator("html[data-system-fonts]").count(), 0);
    const title = await visible.first().getAttribute("data-search-title");
    await input.fill(title);
    await input.press("Enter");
    assert.equal(
      await visible.first().getAttribute("data-search-title"),
      title,
    );
    assert.equal(new URL(page.url()).searchParams.get("q"), title);
    assert.equal(await robots.count(), 1);
    assert.equal(await robots.getAttribute("content"), "noindex");
    await page.reload();
    await page.waitForFunction(
      () =>
        document.querySelector("[data-search-status]").textContent.length > 0,
    );
    assert.equal(await input.inputValue(), title);
    assert.equal(await robots.getAttribute("content"), "noindex");
    await input.fill("zzNONEXISTENT");
    await page.waitForFunction(() =>
      document
        .querySelector("[data-search-status]")
        .textContent.includes("見つかりません"),
    );
    assert.equal(await visible.count(), 0);
    await input.fill("");
    await input.press("Enter");
    assert.equal(await visible.count(), 68);
    assert.equal(await robots.count(), 0);
    await input.dispatchEvent("compositionstart");
    await input.evaluate((e) => {
      e.value = "zzNONEXISTENT";
      e.dispatchEvent(
        new InputEvent("input", { bubbles: true, isComposing: true }),
      );
    });
    await page.waitForTimeout(300);
    assert.equal(await visible.count(), 68);
    await input.dispatchEvent("compositionend");
    await page.waitForFunction(() =>
      document
        .querySelector("[data-search-status]")
        .textContent.includes("見つかりません"),
    );
    await page.goto(base + "/");
    await input.fill(title);
    await input.press("Enter");
    await page.waitForURL(
      (u) => u.pathname === "/search/" && u.searchParams.get("q") === title,
    );
    await page.waitForFunction(
      () =>
        document.querySelector("[data-search-status]").textContent.length > 0,
    );
    await page.goto(
      base + "/search/?q=" + encodeURIComponent("<img src=x onerror=alert(1)>"),
    );
    await page.waitForFunction(() =>
      document
        .querySelector("[data-search-status]")
        .textContent.includes("見つかりません"),
    );
    assert.equal(await page.locator("[data-search-title] img").count(), 0);
    await page.goto(base + "/search/?q=");
    await page.waitForFunction(
      () =>
        document
          .querySelector('head meta[name="robots"]')
          ?.getAttribute("content") === "noindex",
    );
    // History navigation must add/remove the tag without creating duplicates.
    await page.evaluate(() => {
      history.pushState(null, "", "/search/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    assert.equal(await robots.count(), 0);
    await page.goBack();
    await page.waitForFunction(
      () =>
        document
          .querySelector('head meta[name="robots"]')
          ?.getAttribute("content") === "noindex",
    );
    assert.equal(await robots.count(), 1);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: 68 subjects, ranking, submit, URL/reload, empty/no results, debounce, IME, home form, escaped query, mobile overflow, no JS errors",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
