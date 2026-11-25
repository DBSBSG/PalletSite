import { expect, test } from "@playwright/test";

test("serves the Pallet Site homepage", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Pallet Site");
  await expect(
    page.getByRole("heading", { name: "Find your next pallet." }),
  ).toBeVisible();
});

test("filters suppliers, saves a source, and remembers light mode", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Inventory").selectOption("amazon");
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.getByRole("button", { name: "Save Via Trading" }).click();
  await page.getByRole("button", { name: "Saved 1" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "View lots at Via Trading" }),
  ).toHaveAttribute("href", "https://www.viatrading.com/products");
  await page.getByRole("button", { name: "Dark mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "Save Via Trading" }),
  ).toHaveAttribute("aria-pressed", "true");
});
