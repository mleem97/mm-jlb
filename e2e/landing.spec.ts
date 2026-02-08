import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Job Letter Builder/i);
  });

  test("should have a CTA button", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /starten|bewerbung|loslegen/i });
    await expect(cta).toBeVisible();
  });

  test("should navigate to builder intro", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /starten|bewerbung|loslegen/i });
    await cta.click();
    await page.waitForURL(/\/(intro|builder|phases)/);
  });
});
