import { test, expect } from "@playwright/test";

test.describe("About Section E2E Tests", () => {
  test("should display about section with bio and highlights", async ({
    page,
  }) => {
    await page.goto("/#about");

    // Check about heading
    await expect(page.locator("#about h2")).toContainText("About Me");

    // Check subtitle
    await expect(page.locator("#about h3")).toContainText(
      "Designing Scalable Data & AI Systems",
    );

    // Check bio content
    await expect(page.locator("#about")).toContainText(
      "Principal Data Engineer",
    );
    await expect(page.locator("#about")).toContainText(
      "PhD in Artificial Intelligence",
    );

    // Check highlight tags
    await expect(page.locator("#about")).toContainText("Data Engineering");
    await expect(page.locator("#about")).toContainText("Machine Learning");
    await expect(page.locator("#about")).toContainText("MLOps");

    // Check CTA button
    await expect(page.locator('#about a[href="#contact"]')).toContainText(
      "Get In Touch",
    );
  });

  test("should have proper about section structure", async ({ page }) => {
    await page.goto("/#about");

    // Check section is visible
    await expect(page.locator("#about")).toBeVisible();

    // Check all paragraphs are present
    const paragraphs = page.locator("#about p");
    await expect(paragraphs).toHaveCount(3);

    // Check highlight tags count
    const highlights = page.locator("#about span.px-4.py-2.rounded-full");
    await expect(highlights).toHaveCount(11);
  });
});
