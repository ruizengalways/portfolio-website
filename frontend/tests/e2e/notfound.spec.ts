import { test, expect } from "@playwright/test";

test.describe("NotFound Page E2E Tests", () => {
  test("should display 404 page for invalid routes", async ({ page }) => {
    await page.goto("/nonexistent-page");

    // Check 404 content
    await expect(page.locator("h1")).toContainText("404");
    await expect(page.locator("text=Page Not Found")).toBeVisible();

    // Check back to home link
    await expect(page.locator('a[href="/"]')).toContainText("Go Home");
  });

  test("should navigate back to home from 404", async ({ page }) => {
    await page.goto("/invalid");

    const homeLink = page.locator('a[href="/"]');
    await homeLink.click();

    // Should be on home
    await expect(page.locator("#hero")).toBeVisible();
  });
});
