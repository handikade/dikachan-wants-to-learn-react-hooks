import { expect, test } from "@playwright/test";

test.describe("UseStateSimple", () => {
  test("increments and decrements count", async ({ page }) => {
    await page.goto("/state/simple");

    const count = page.getByTestId("count");
    const increment = page.getByTestId("increment-btn");
    const decrement = page.getByTestId("decrement-btn");

    await expect(count).toHaveText("Count: 0");
    await increment.click();
    await expect(count).toHaveText("Count: 1");
    await increment.click();
    await expect(count).toHaveText("Count: 2");
    await decrement.click();
    await expect(count).toHaveText("Count: 1");
    await decrement.click();
    await decrement.click();
    await expect(count).toHaveText("Count: -1");
  });
});
