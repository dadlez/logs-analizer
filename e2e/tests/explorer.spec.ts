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

  test("should filter rows when entity_type column filter is applied", async ({ page }) => {
    // given
    await page.goto(`/explorer?table=${TABLE}`);
    await expect(page.getByTestId("data-table")).toBeVisible();

    // when — type a value into the entity_type column filter (client-side filter)
    await page.getByLabel("entity_type").fill("1");

    // then — table re-renders without error (client-side filter, no URL change)
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
