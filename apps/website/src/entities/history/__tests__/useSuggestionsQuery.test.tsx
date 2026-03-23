import { expect, test, describe } from "vite-plus/test";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSuggestionsQuery } from "../useSuggestionsQuery.ts";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useSuggestionsQuery", () => {
  test("should return suggestion strings when API responds for user_email field", async () => {
    // given / when
    const { result } = renderHook(() => useSuggestionsQuery("user_email", ""), { wrapper });

    // then
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data?.data)).toBe(true);
    expect(result.current.data?.data[0]).toBe("test@example.com");
  });

  test("should be in loading state before API responds", () => {
    // given / when
    const { result } = renderHook(() => useSuggestionsQuery("organization_id", ""), { wrapper });

    // then
    expect(result.current.isLoading).toBe(true);
  });
});
