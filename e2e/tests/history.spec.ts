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

  test("should filter rows when action_type filter is set to Added", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when
    await page.getByLabel("Action Type").click();
    await page.getByRole("option", { name: "Added" }).click();

    // then — URL contains numeric action_type param, no error page
    await expect(page).toHaveURL(/action_type=1/);
    await expect(page.getByTestId("history-table")).toBeVisible();
    await expect(page.getByTestId("data-table")).toBeVisible();
  });

  test("should filter rows when action_type filter is set to Deleted", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when
    await page.getByLabel("Action Type").click();
    await page.getByRole("option", { name: "Deleted" }).click();

    // then — URL contains numeric action_type param, no error page
    await expect(page).toHaveURL(/action_type=2/);
    await expect(page.getByTestId("history-table")).toBeVisible();
    await expect(page.getByTestId("data-table")).toBeVisible();
  });

  test("should reset action_type filter when All option is selected", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}&action_type=1`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when
    await page.getByLabel("Action Type").click();
    await page.getByRole("option", { name: "All" }).click();

    // then — action_type param removed from URL
    await expect(page).not.toHaveURL(/action_type/);
    await expect(page.getByTestId("data-table")).toBeVisible();
  });

  test("should clear all filters when clear button is clicked", async ({ page }) => {
    // given
    await page.goto(`/history?table=${TABLE}&action_type=1`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when
    await page.getByTestId("btn-clear-filters").click();

    // then — filter params removed from URL, table still renders
    await expect(page).not.toHaveURL(/action_type/);
    await expect(page).not.toHaveURL(/user_email/);
    await expect(page.getByTestId("data-table")).toBeVisible();
  });
});
