import { test, expect } from "@playwright/test";

const TABLE = "audit_log";

test.describe("Explorer page", () => {
  test("should display nav bar and reach explorer page on navigation", async ({ page }) => {
    // given
    await page.goto("/");

    // when — root redirects to /explorer
    await page.waitForURL("**/explorer**");

    // then
    await expect(page.getByTestId("nav-bar")).toBeVisible();
    await expect(page.getByTestId("nav-explorer")).toBeVisible();
  });

  test("should display log rows when table is selected", async ({ page }) => {
    // given
    await page.goto(`/explorer?table=${TABLE}`);

    // when
    await expect(page.getByTestId("data-table")).toBeVisible();

    // then
    await expect(page.getByTestId("data-row-0")).toBeVisible();
  });

  test("should update rows when module filter is applied", async ({ page }) => {
    // given
    await page.goto(`/explorer?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when — type a module name and apply
    await page.getByTestId("filter-module").fill("contracts");
    await page.getByTestId("btn-apply-filters").click();

    // then — URL updated and table re-renders (may be empty if no match, but no error)
    await expect(page).toHaveURL(/module=contracts/);
    await expect(page.getByTestId("data-table")).toBeVisible();
  });

  test("should paginate to next page when next page button is clicked", async ({ page }) => {
    // given
    await page.goto(`/explorer?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();
    await expect(page.getByTestId("btn-next-page")).toBeVisible();

    // when
    await page.getByTestId("btn-next-page").click();

    // then
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByTestId("data-row-0")).toBeVisible();
  });
});
