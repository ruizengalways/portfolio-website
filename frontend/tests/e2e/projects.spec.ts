import { test, expect } from "@playwright/test";

test.describe("Projects Section E2E Tests", () => {
  test("should display projects section with project cards", async ({
    page,
  }) => {
    await page.goto("/#projects");

    // Check projects heading
    await expect(page.locator("#projects h2")).toContainText(
      "Featured Projects",
    );

    // Check description
    await expect(page.locator("#projects")).toContainText(
      "Showcasing robust architectures",
    );

    // Check project card
    await expect(page.locator("#projects")).toContainText("Portfolio Website");

    // Check project description
    await expect(page.locator("#projects")).toContainText(
      "high-performance personal infrastructure",
    );

    // Check tags
    await expect(page.locator("#projects")).toContainText("React");
    await expect(page.locator("#projects")).toContainText("TailwindCSS");
    await expect(page.locator("#projects")).toContainText("Cloudflare");

    // Check links
    const demoLink = page.locator(
      'a[href="https://ruizeng-lucky.workers.dev"]',
    );
    await expect(demoLink).toBeVisible();

    const githubLink = page.locator(
      'a[href*="github.com/ruizengalways/portfolio-website"]',
    );
    await expect(githubLink).toBeVisible();

    // Check CTA button (target by link text)
    await expect(
      page.getByRole("link", { name: "Check My Github" }),
    ).toBeVisible();
  });

  test("should have proper projects section structure", async ({ page }) => {
    await page.goto("/#projects");

    // Check section is visible
    await expect(page.locator("#projects")).toBeVisible();

    // Check grid layout (ensure at least one grid exists)
    const grid = page.locator(".grid");
    await expect(await grid.count()).toBeGreaterThan(0);

    // Check project card (at least one)
    const card = page.locator(".bg-card");
    await expect(await card.count()).toBeGreaterThanOrEqual(1);

    // Check image
    const image = page.locator('img[alt="Portfolio Website"]');
    await expect(image).toBeVisible();

    // Check tags count (ensure some tags present)
    const tags = page.locator("span.px-2.py-1");
    await expect(await tags.count()).toBeGreaterThan(0);
  });
});
