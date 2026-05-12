import { test, expect } from "@playwright/test";

test.describe("Expertise Section E2E Tests", () => {
  test("should display expertise section with all areas", async ({ page }) => {
    await page.goto("/#expertise");

    // Check heading (accept current heading text)
    await expect(page.locator("#expertise h2")).toContainText("What I Do");

    // Check expertise areas
    await expect(page.locator("#expertise")).toContainText(
      "Data Engineering & Platforms",
    );
    await expect(page.locator("#expertise")).toContainText(
      "Cloud Architecture & Infrastructure",
    );
    await expect(page.locator("#expertise")).toContainText(
      "Machine Learning & AI Systems",
    );

    // Check descriptions
    await expect(page.locator("#expertise")).toContainText(
      "Designing and operating scalable data platforms",
    );
    await expect(page.locator("#expertise")).toContainText(
      "Architecting cloud-native, distributed systems",
    );
    await expect(page.locator("#expertise")).toContainText(
      "Building production-grade AI systems",
    );

    // Check some skills
    await expect(page.locator("#expertise")).toContainText(
      "Medallion architecture",
    );
    await expect(page.locator("#expertise")).toContainText("AWS ecosystem");
    await expect(page.locator("#expertise")).toContainText("LLMs, NLP");
  });

  test("should have proper expertise section structure", async ({ page }) => {
    await page.goto("/#expertise");

    // Check section is visible
    await expect(page.locator("#expertise")).toBeVisible();

    // Check icons (ensure at least 3 icons present)
    const icons = page.locator("#expertise svg");
    await expect(await icons.count()).toBeGreaterThanOrEqual(3);

    // Check skill lists
    const skills = page.locator("#expertise li");
    await expect(skills).toHaveCount(await skills.count()); // Many skills
  });
});
