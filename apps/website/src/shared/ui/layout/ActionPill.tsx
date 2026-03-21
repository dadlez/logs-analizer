import { useTheme } from "@mui/material/styles";
import { Badge } from "./Badge.tsx";
import { resolveActionLabel, resolveEventColor } from "../../lib/domain.ts";

export function ActionPill({ value }: { value: number | string }) {
  const {
    palette: { colors },
  } = useTheme();
  const label = resolveActionLabel(value);
  return <Badge label={label} accent={resolveEventColor(label, colors)} />;
}
