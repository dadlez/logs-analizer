import { test, expect } from "@playwright/test";

const TABLE = "audit_log";

test.describe("History page", () => {
  test("should display correct column headers when navigating to history", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);

    // when
    await expect(page.getByTestId("history-table")).toBeVisible();
    await expect(page.getByTestId("data-table")).toBeVisible();

    // then
    await expect(page.getByRole("columnheader", { name: /user email/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /action type/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /contract/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /duration/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /entities/i })).toBeVisible();
  });

  test("should display data rows when history loads", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when / then
    await expect(page.getByTestId("data-row-0")).toBeVisible();
    await expect(page.getByTestId("btn-next-page")).toBeVisible();
  });

  test("should paginate to page 2 when next page is clicked", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);
    await expect(page.getByTestId("btn-next-page")).toBeVisible();

    // when
    await page.getByTestId("btn-next-page").click();

    // then
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByTestId("data-row-0")).toBeVisible();
  });

  test("should filter rows when user_email filter is applied", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when
    await page.getByTestId("filter-user-email").fill("nonexistent@test.invalid");
    // filter updates on change (debounced via navigate)
    await page.waitForTimeout(500);

    // then — URL contains user_email param and table re-renders without error
    await expect(page).toHaveURL(/user_email=nonexistent/);
    await expect(page.getByTestId("data-table")).toBeVisible();
  });
});
