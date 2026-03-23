import { useQuery } from "@tanstack/react-query";
import type { SuggestionField } from "contract";
import { fetchSuggestions } from "./api.ts";

export function useSuggestionsQuery(field: SuggestionField) {
  return useQuery({
    queryKey: ["history-suggestions", field],
    queryFn: () => fetchSuggestions(field),
    staleTime: 30_000,
  });
}
