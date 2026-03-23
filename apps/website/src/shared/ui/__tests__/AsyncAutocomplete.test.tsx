import { expect, test, describe } from "vite-plus/test";
import { vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { AsyncAutocomplete } from "../form/AsyncAutocomplete.tsx";

describe("AsyncAutocomplete", () => {
  test("should render the input with the given label", () => {
    // given / when
    render(
      <AsyncAutocomplete
        label="User Email"
        options={[]}
        loading={false}
        value=""
        onChange={vi.fn()}
      />,
    );

    // then
    expect(screen.getByLabelText("User Email")).toBeDefined();
  });

  test("should show a loading spinner when loading is true", () => {
    // given / when
    render(
      <AsyncAutocomplete
        label="User Email"
        options={[]}
        loading={true}
        value=""
        onChange={vi.fn()}
      />,
    );

    // then
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  test("should not show a loading spinner when loading is false", () => {
    // given / when
    render(
      <AsyncAutocomplete
        label="User Email"
        options={[]}
        loading={false}
        value=""
        onChange={vi.fn()}
      />,
    );

    // then
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  test("should call onChange when user types in the input", () => {
    // given
    const handleChange = vi.fn();
    render(
      <AsyncAutocomplete
        label="User Email"
        options={[]}
        loading={false}
        value=""
        onChange={handleChange}
      />,
    );
    const input = screen.getByRole("combobox");

    // when
    fireEvent.change(input, { target: { value: "alice" } });

    // then
    expect(handleChange).toHaveBeenCalledWith("alice");
  });
});
