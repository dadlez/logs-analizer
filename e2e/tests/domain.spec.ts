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

  test("should show co-occurrence tab content when co-occurrence tab is clicked", async ({
    page,
  }) => {
    // given
    await page.goto(`/domain?table=${TABLE}`);
    await expect(page.getByRole("tab", { name: "Co-occurrence" })).toBeVisible();

    // when
    await page.getByRole("tab", { name: "Co-occurrence" }).click();

    // then
    await expect(page.getByText("Raw co-occurrence counts")).toBeVisible();
  });

  test("should show cascade patterns tab content when cascade patterns tab is clicked", async ({
    page,
  }) => {
    // given
    await page.goto(`/domain?table=${TABLE}`);

    // when
    await page.getByRole("tab", { name: "Cascade Patterns" }).click();

    // then
    await expect(
      page.getByText("Multi-module transaction patterns ordered by frequency"),
    ).toBeVisible();
  });
});
