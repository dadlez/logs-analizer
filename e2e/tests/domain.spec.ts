import { test, expect } from "@playwright/test";

const TABLE = "audit_log";

test.describe("Domain page", () => {
  test("should display module cards when analytics loads", async ({ page }) => {
    // given
    await page.goto(`/domain?table=${TABLE}`);

    // when
    await expect(page.getByRole("tab", { name: "Modules" })).toBeVisible();

    // then — at least one module card is rendered
    await expect(page.locator("[data-testid^='module-card-']").first()).toBeVisible();
  });

  test("should show flows tab content when flows tab is clicked", async ({ page }) => {
    // given
    await page.goto(`/domain?table=${TABLE}`);
    await expect(page.getByRole("tab", { name: "Flows" })).toBeVisible();

    // when
    await page.getByRole("tab", { name: "Flows" }).click();

    // then
    await expect(page.locator("[data-testid^='flow-sequence-']").first()).toBeVisible();
  });

  test("should show event types tab content when event types tab is clicked", async ({ page }) => {
    // given
    await page.goto(`/domain?table=${TABLE}`);

    // when
    await page.getByRole("tab", { name: "Event Types" }).click();

    // then
    await expect(page.locator("text=Count:").first()).toBeVisible();
  });
});
