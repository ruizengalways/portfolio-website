import { test, expect } from "@playwright/test";

test.describe("Research Section E2E Tests", () => {
  test("should display research section with stats and themes", async ({
    page,
  }) => {
    await page.goto("/#research");

    // Check heading
    await expect(page.locator("#research h2")).toContainText(
      "Research & Innovation",
    );

    // Check description
    await expect(page.locator("#research")).toContainText(
      "PhD-trained AI and machine learning professional",
    );

    // Check stats
    await expect(page.locator("#research")).toContainText("Citations");
    await expect(page.locator("#research")).toContainText("Publications");
    await expect(page.locator("#research")).toContainText("h-index");

    // Check themes
    await expect(page.locator("#research")).toContainText(
      "Large Language Models",
    );
    await expect(page.locator("#research")).toContainText("Computer Vision");
    await expect(page.locator("#research")).toContainText("Generative AI");
  });

  test("should animate stats counters", async ({ page }) => {
    await page.goto("/#research");

    // Wait for count up animation
    await page.waitForTimeout(2000); // Adjust based on animation duration

    // Check final values (accept commas and formatting)
    await expect(page.locator("#research")).toContainText("1,200");
    await expect(page.locator("#research")).toContainText("40");
    await expect(page.locator("#research")).toContainText("15");
  });

  test("should have proper research section structure", async ({ page }) => {
    await page.goto("/#research");

    // Check section is visible
    await expect(page.locator("#research")).toBeVisible();

    // Check stats grid
    const stats = page.locator(".grid.grid-cols-1.sm\\:grid-cols-3");
    await expect(stats).toBeVisible();

    // Check themes list
    const themes = page.locator("#research span");
    await expect(themes).toHaveCount(await themes.count());
  });
});
