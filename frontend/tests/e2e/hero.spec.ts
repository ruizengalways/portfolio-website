import { test, expect } from "@playwright/test";

test.describe("Hero Section E2E Tests", () => {
  test("should display hero section with main content", async ({ page }) => {
    await page.goto("/");

    // Check main heading
    await expect(page.locator("h1")).toContainText("Hi, I'm Dr Rui Zeng");

    // Check subtitle
    await expect(page.locator("#hero h2")).toContainText(
      "PhD in Artificial Intelligence",
    );

    // Check professional titles
    await expect(page.locator("#hero")).toContainText("Full Stack Developer");
    await expect(page.locator("#hero")).toContainText("Data Engineer");

    // Check description
    await expect(page.locator("#hero")).toContainText(
      "I design and deliver end-to-end intelligent systems",
    );

    // Check CTA button
    await expect(page.locator('#hero a[href="#expertise"]')).toContainText(
      "View My Expertise",
    );

    // Check scroll indicator
    await expect(page.locator("#hero")).toContainText("Scroll");
  });

  test("should have proper hero section structure", async ({ page }) => {
    await page.goto("/");

    // Check section id
    await expect(page.locator("#hero")).toBeVisible();

    // Check responsive classes (hard to test directly, but ensure content is visible)
    await expect(page.locator("h1")).toBeVisible();
  });
});
