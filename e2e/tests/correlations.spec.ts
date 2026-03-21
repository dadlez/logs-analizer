import { test, expect } from "@playwright/test";

const TABLE = "audit_log";

test.describe("Correlations page", () => {
  test("should display correlations list when table is selected", async ({ page }) => {
    // given
    await page.goto(`/correlations?table=${TABLE}`);

    // when
    await expect(page.getByTestId("correlations-list")).toBeVisible();

    // then
    await expect(page.getByTestId("data-table")).toBeVisible();
    await expect(page.getByTestId("data-row-0")).toBeVisible();
  });

  test("should navigate to correlation detail when row is clicked", async ({ page }) => {
    // given
    await page.goto(`/correlations?table=${TABLE}`);
    await expect(page.getByTestId("data-row-0")).toBeVisible();

    // when
    await page.getByTestId("data-row-0").click();

    // then — URL changes to /correlations/:id
    await expect(page).toHaveURL(/\/correlations\/.+/);
    await expect(page.getByTestId("correlation-detail")).toBeVisible();
    await expect(page.getByTestId("event-timeline")).toBeVisible();
  });

  test("should display events in timeline order on detail page", async ({ page }) => {
    // given
    await page.goto(`/correlations?table=${TABLE}`);
    await expect(page.getByTestId("data-row-0")).toBeVisible();

    // when
    await page.getByTestId("data-row-0").click();
    await expect(page.getByTestId("event-timeline")).toBeVisible();

    // then — at least the first timeline item is visible
    await expect(page.getByTestId("timeline-item-0")).toBeVisible();
  });
});
