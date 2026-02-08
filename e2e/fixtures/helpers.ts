import type { Page } from "@playwright/test";
import { buildStorageState } from "./test-data";

/**
 * Seed the app state via localStorage before navigating.
 */
export async function seedAppState(page: Page, overrides?: Record<string, unknown>) {
  await page.addInitScript((data: string) => {
    localStorage.setItem("application-storage", data);
  }, buildStorageState(overrides));
}

/**
 * Navigate to a page and wait for hydration.
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

/**
 * Fill the personal data form (Step 1).
 */
export async function fillPersonalDataForm(page: Page) {
  await page.fill('[id="firstName"]', "Max");
  await page.fill('[id="lastName"]', "Mustermann");
  await page.fill('[id="email"]', "max.mustermann@example.com");
  await page.fill('[id="phone"]', "+49 170 1234567");
  await page.fill('[id="street"]', "Musterstraße 42");
  await page.fill('[id="zip"]', "30159");
  await page.fill('[id="city"]', "Hannover");
}
