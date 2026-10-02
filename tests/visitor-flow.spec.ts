import { test, expect } from "@playwright/test";

test("visitors can search and filter the static directory", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your next");
  const directory = page.locator("#directory");
  const search = page.getByRole("searchbox");
  await search.fill("Apple");
  await expect(directory.locator(".tenant:visible")).toHaveCount(1);
  await expect(directory.locator(".tenant:visible")).toContainText("Apple");
  await expect(directory.getByRole("status")).toHaveText("1 place to explore");

  await search.fill("");
  await directory.getByRole("button", { name: "Dining", exact: true }).click();
  await expect(directory.locator(".tenant:visible")).toHaveCount(3);
  await expect(directory.getByRole("button", { name: "Dining", exact: true })).toHaveAttribute("aria-pressed", "true");
  await search.fill("no-such-place");
  await expect(directory.getByRole("heading", { name: "No matching places." })).toBeVisible();
  await directory.getByRole("button", { name: "Reset search" }).click();
  await expect(directory.locator(".tenant:visible")).toHaveCount(6);
  await expect(search).toBeFocused();
});

test("discovery links preset categories and the page fits its viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Make it a moment/ }).click();
  await expect(page.locator("#directory .tenant:visible")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Dining", exact: true })).toHaveAttribute("aria-pressed", "true");
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
  await expect(page.getByRole("link", { name: /Get directions/ })).toHaveAttribute("href", /google.com\/maps\/dir/);
});

test("mobile navigation closes with Escape and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation behavior");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const close = page.getByRole("button", { name: "Close menu", exact: true });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});
