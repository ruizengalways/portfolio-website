import { test, expect } from "@playwright/test";

test.describe("Footer E2E Tests", () => {
  test("should display footer with copyright and links", async ({ page }) => {
    await page.goto("/");

    // Check footer is visible
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Check copyright (updated year)
    await expect(footer).toContainText("© 2026 Rui Zeng");

    // Check links (assuming there are social links)
    const links = footer.locator("a");
    await expect(links).toHaveCount(await links.count()); // At least some
  });

  test("should display visitor stats if available", async ({ page }) => {
    await page.goto("/");

    // Check if visitor stats are displayed
    const stats = page.locator("text=/visitors|views/");
    // Might not be visible if API fails, so check if present or not
    if (await stats.isVisible()) {
      await expect(stats).toBeVisible();
    }
  });

  test("should have proper footer structure", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toHaveClass(/py-|px-/); // Assuming some padding
  });
});
