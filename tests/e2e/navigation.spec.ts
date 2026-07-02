import { expect, test } from "@playwright/test";

test("keeps the selected sidebar section highlighted", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("test");
  await page.locator('input[name="password"]').fill("test");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('nav a[href="/dashboard"]')).toHaveAttribute("aria-current", "page");

  await page.locator('nav a[href="/inventory"]').click();
  await expect(page).toHaveURL(/\/inventory$/);
  await expect(page.locator('nav a[href="/inventory"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator('nav a[href="/dashboard"]')).not.toHaveAttribute("aria-current", "page");
});
