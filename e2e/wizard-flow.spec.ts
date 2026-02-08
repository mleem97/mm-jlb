import { test, expect } from "@playwright/test";
import { seedAppState, fillPersonalDataForm, navigateTo } from "./fixtures/helpers";

test.describe("Wizard Flow", () => {
  test("should fill personal data and navigate to next step", async ({ page }) => {
    await navigateTo(page, "/phases/persoenliche-daten");

    await fillPersonalDataForm(page);

    // Wait for form validation
    await page.waitForTimeout(500);

    // Click "Weiter" button
    const nextButton = page.getByRole("button", { name: /weiter/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Should navigate to step 2
    await page.waitForURL(/\/phases\/berufserfahrung/);
  });

  test("should load step 2 with seeded data", async ({ page }) => {
    await seedAppState(page);
    await navigateTo(page, "/phases/berufserfahrung");

    // Page should load without errors
    await expect(page.locator("body")).toContainText(/Berufserfahrung|Schritt 2/i);
  });

  test("should load cover letter step with seeded data", async ({ page }) => {
    await seedAppState(page);
    await navigateTo(page, "/phases/anschreiben");

    // Should see sub-steps
    await expect(page.locator("body")).toContainText(/Stelleninfos|Anschreiben/i);
  });

  test("should load export step with seeded data", async ({ page }) => {
    await seedAppState(page);
    await navigateTo(page, "/phases/export");

    // Should see export format options
    await expect(page.locator("body")).toContainText(/PDF|ZIP|JSON/i);
  });
});
