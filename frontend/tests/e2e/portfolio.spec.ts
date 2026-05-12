import { test, expect } from "@playwright/test";

test.describe("Portfolio Website E2E Tests", () => {
  test("should load homepage and display main sections", async ({ page }) => {
    await page.goto("/");

    // Check main title (match hero title)
    await expect(page.locator("h1")).toContainText("Hi, I'm Dr");

    // Check navigation
    await expect(page.locator("nav")).toBeVisible();

    // Check main sections
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#skills")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("should navigate between sections smoothly", async ({ page }) => {
    await page.goto("/");

    // On mobile, open the hamburger menu so nav links are in viewport
    const openMenu = page.locator('button[aria-label="Open Menu"]').first();
    if (await openMenu.isVisible()) {
      await openMenu.click();
      await expect(
        page.getByRole("button", { name: "Close Menu" }),
      ).toBeVisible();
    }

    // Click on skills section link (.first() avoids strict mode with desktop+mobile links)
    const skillsLink = page
      .getByRole("link", { name: "Skills", exact: true })
      .first();
    await skillsLink.click();

    // Check if scrolled to skills section (allow time for smooth scroll)
    await expect(page.locator("#skills")).toBeInViewport({ timeout: 10000 });

    // On mobile, re-open the menu for the next link
    if (await openMenu.isVisible()) {
      await openMenu.click();
      await expect(
        page.getByRole("button", { name: "Close Menu" }),
      ).toBeVisible();
    }

    // Click on contact section
    const contactLink = page
      .getByRole("link", { name: "Contact", exact: true })
      .first();
    await contactLink.click();
    await expect(page.locator("#contact")).toBeInViewport({ timeout: 10000 });
  });

  test("should submit contact form successfully", async ({ page }) => {
    // Intercept the contact API so tests don't depend on backend
    await page.route("**/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto("/");

    // Scroll to contact section
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Fill out the form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message for e2e testing.",
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message from sonner toast
    await expect(page.locator("text=Message sent!")).toBeVisible({
      timeout: 10000,
    });
  });

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

  test("should display skills section with all categories", async ({
    page,
  }) => {
    await page.goto("/#skills");

    // Check skills heading
    await expect(page.locator("#skills h2")).toContainText(
      "How I Build Systems",
    );

    // Check skill categories
    await expect(page.locator("#skills")).toContainText("Core Languages");
    await expect(page.locator("#skills")).toContainText("Data Platforms");
    await expect(page.locator("#skills")).toContainText(
      "Cloud & Infrastructure",
    );
    await expect(page.locator("#skills")).toContainText(
      "Machine Learning & AI",
    );
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Check that mobile menu works if present
    // Assuming there's a mobile menu button
    const mobileMenu = page.locator(".mobile-menu-button");
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator(".mobile-menu")).toBeVisible();
    }

    // Check sections are still accessible
    await expect(page.locator("#hero")).toBeVisible();
  });

  test("should handle 404 page", async ({ page }) => {
    await page.goto("/nonexistent-page");

    // Check 404 page content
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });

  test("should display projects section with project cards", async ({
    page,
  }) => {
    await page.goto("/#projects");

    // Check projects heading
    await expect(page.locator("#projects h2")).toContainText(
      "Featured Projects",
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

    // Check links
    const demoLink = page.locator(
      'a[href="https://ruizeng-lucky.workers.dev"]',
    );
    await expect(demoLink).toBeVisible();

    const githubLink = page.locator(
      'a[href*="github.com/ruizengalways/portfolio-website"]',
    );
    await expect(githubLink).toBeVisible();

    // Check CTA button (target the link by role/text to avoid duplicates)
    await expect(
      page.getByRole("link", { name: "Check My Github" }),
    ).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    await page.goto("/");

    // Assuming there's a theme toggle button
    const themeToggle = page.locator(".theme-toggle");
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Check if theme changed (e.g., by checking class on body or html)
      await expect(page.locator("html")).toHaveClass(/dark/); // Adjust based on implementation
    }
  });
});
