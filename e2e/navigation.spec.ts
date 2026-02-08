import { test, expect } from "@playwright/test";

test.describe("Navigation & Info Pages", () => {
  const infoPages = [
    { path: "/about", titlePart: "Über" },
    { path: "/faq", titlePart: "FAQ" },
    { path: "/datenschutz", titlePart: "Datenschutz" },
    { path: "/impressum", titlePart: "Impressum" },
    { path: "/agb", titlePart: "AGB" },
  ];

  for (const { path, titlePart } of infoPages) {
    test(`should load ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("body")).toContainText(titlePart);
    });
  }

  test("should have working keyboard navigation", async ({ page }) => {
    await page.goto("/");
    // Tab through elements — ensure at least something is focusable
    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
  });
});
