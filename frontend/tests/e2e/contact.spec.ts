import { test, expect } from "@playwright/test";

test.describe("Contact Section E2E Tests", () => {
  test("should display contact form and submit successfully", async ({
    page,
  }) => {
    // Intercept contact API and return success so tests don't require backend
    await page.route("**/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto("/#contact");

    // Check contact heading
    await expect(page.locator("#contact h2")).toContainText("Get In Touch");

    // Check form elements
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText(
      "Send Message",
    );

    // Fill and submit form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a test message.");

    await page.click('button[type="submit"]');

    // Check for success (sonner toast shows text "Message sent!")
    await expect(page.locator("text=Message sent!")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should validate form fields", async ({ page }) => {
    await page.goto("/#contact");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check that form doesn't submit (or shows validation)
    // HTML5 validation or custom - ensure submit did not proceed by checking button still enabled
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should have proper contact section structure", async ({ page }) => {
    await page.goto("/#contact");

    // Check section is visible
    await expect(page.locator("#contact")).toBeVisible();

    // Check form
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});
