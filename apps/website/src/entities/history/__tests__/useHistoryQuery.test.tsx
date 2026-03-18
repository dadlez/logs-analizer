import { expect, test, describe } from "vite-plus/test";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useHistoryQuery } from "../useHistoryQuery.ts";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useHistoryQuery", () => {
  test("should return history entries with user_email and action_type when API responds", async () => {
    // given / when
    const { result } = renderHook(() => useHistoryQuery({ table: "audit_log" }), { wrapper });

    // then
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data;
    expect(data?.data[0]).toMatchObject({ user_email: "test@example.com", action_type: 1 });
  });

  test("should return loading state when request is in flight", () => {
    // given / when
    const { result } = renderHook(() => useHistoryQuery({ table: "audit_log" }), { wrapper });

    // then
    expect(result.current.isLoading).toBe(true);
  });

  test("should not run query when table is empty", () => {
    // given / when
    const { result } = renderHook(() => useHistoryQuery({ table: "" }), { wrapper });

    // then
    expect(result.current.fetchStatus).toBe("idle");
  });
});
