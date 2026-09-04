import { expect, test } from "@playwright/test";

test("loads the simulator from the production server", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LEDアクスタ シミュレーター" })).toBeVisible();
  await expect(page.getByTestId("preview-empty-state")).toBeVisible();
});
