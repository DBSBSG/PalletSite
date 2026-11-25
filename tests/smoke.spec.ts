import { expect, test } from "@playwright/test";

test("serves the Pallet Site homepage", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Pallet Site");
  await expect(
    page.getByRole("heading", { name: "Pallet Site" }),
  ).toBeVisible();
});
