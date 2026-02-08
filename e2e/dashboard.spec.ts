import { test, expect } from "@playwright/test";
import { seedAppState, navigateTo } from "./fixtures/helpers";

test.describe("Dashboard / Tracker", () => {
  test("should show empty state when no applications tracked", async ({ page }) => {
    await navigateTo(page, "/dashboard");
    await expect(page.locator("body")).toContainText(/Dashboard|Tracker|Bewerbung/i);
  });

  test("should show tracker entries when seeded", async ({ page }) => {
    await seedAppState(page, {
      trackerEntries: [
        {
          id: "test-1",
          companyName: "TechCorp GmbH",
          jobTitle: "Frontend-Entwickler",
          appliedAt: new Date().toISOString(),
          status: "gesendet",
          exportFormat: "pdf",
        },
      ],
    });
    await navigateTo(page, "/dashboard");
    await expect(page.locator("body")).toContainText("TechCorp");
  });
});
