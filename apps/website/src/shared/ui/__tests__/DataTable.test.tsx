import { expect, test, describe } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../DataTable.tsx";

interface Row {
  id: number;
  name: string;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

describe("DataTable", () => {
  test("should render column headers when columns are provided", () => {
    // given / when
    render(<DataTable columns={columns} data={[]} />);

    // then
    expect(screen.getByRole("columnheader", { name: "ID" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeDefined();
  });

  test("should render correct number of rows when data is provided", () => {
    // given
    const data: Row[] = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    // when
    render(<DataTable columns={columns} data={data} />);

    // then
    expect(screen.getByTestId("data-row-0")).toBeDefined();
    expect(screen.getByTestId("data-row-1")).toBeDefined();
  });

  test("should show loading spinner when isLoading is true", () => {
    // given / when
    render(<DataTable columns={columns} data={[]} isLoading />);

    // then
    expect(screen.getByTestId("loading-spinner")).toBeDefined();
  });
});
