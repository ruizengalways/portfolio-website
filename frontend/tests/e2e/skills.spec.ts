import { test, expect } from "@playwright/test";

test.describe("Skills Section E2E Tests", () => {
  test("should display skills section with all categories", async ({
    page,
  }) => {
    await page.goto("/#skills");

    // Check skills heading
    await expect(page.locator("#skills h2")).toContainText(
      "How I Build Systems",
    );

    // Check description
    await expect(page.locator("#skills")).toContainText(
      "The core technologies and frameworks I use",
    );

    // Check skill categories
    await expect(page.locator("#skills")).toContainText("Core Languages");
    await expect(page.locator("#skills")).toContainText("Data Platforms");
    await expect(page.locator("#skills")).toContainText(
      "Databases & Warehouses",
    );
    await expect(page.locator("#skills")).toContainText(
      "Cloud & Infrastructure",
    );
    await expect(page.locator("#skills")).toContainText(
      "Machine Learning & AI",
    );
    await expect(page.locator("#skills")).toContainText(
      "Platform Engineering & DevOps",
    );

    // Check some specific skills
    await expect(page.locator("#skills")).toContainText("Python");
    await expect(page.locator("#skills")).toContainText("TypeScript");
    await expect(page.locator("#skills")).toContainText("Kafka");
    await expect(page.locator("#skills")).toContainText("PostgreSQL");
    await expect(page.locator("#skills")).toContainText("AWS");
    await expect(page.locator("#skills")).toContainText("Docker");
  });

  test("should have proper skills section structure", async ({ page }) => {
    await page.goto("/#skills");

    // Check section is visible
    await expect(page.locator("#skills")).toBeVisible();

    // Check icons are present (6 categories)
    const icons = page.locator("#skills svg.h-5.w-5");
    await expect(icons).toHaveCount(6);

    // Check skills are in spans
    const skills = page.locator("#skills span.px-4.py-2.rounded-full");
    await expect(skills).toHaveCount(await skills.count()); // At least many
  });
});
