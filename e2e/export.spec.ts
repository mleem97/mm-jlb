import { test, expect } from "@playwright/test";
import { seedAppState, navigateTo } from "./fixtures/helpers";

test.describe("Export", () => {
  test.beforeEach(async ({ page }) => {
    await seedAppState(page);
  });

  test("should show export format options", async ({ page }) => {
    await navigateTo(page, "/phases/export");

    await expect(page.getByText("PDF")).toBeVisible();
    await expect(page.getByText("ZIP")).toBeVisible();
    await expect(page.getByText("JSON")).toBeVisible();
  });

  test("should select JSON format and download", async ({ page }) => {
    await navigateTo(page, "/phases/export");

    // Select JSON format
    await page.getByText("JSON").click();

    // Download
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /json herunterladen/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain(".json");
  });

  test("should expand email section", async ({ page }) => {
    await navigateTo(page, "/phases/export");

    // Click email section
    await page.getByText("Per E-Mail senden").click();

    // Email form should appear
    await expect(page.getByText("Empfänger")).toBeVisible();
    await expect(page.getByText("Betreff")).toBeVisible();
  });
});
