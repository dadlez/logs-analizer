import { useTheme } from "@mui/material/styles";
import { Badge } from "./Badge.tsx";
import { resolveModuleLabel, resolveModuleColor } from "../../lib/domain.ts";

export function ModulePill({ value }: { value: number | string }) {
  const {
    palette: { colors },
  } = useTheme();
  const label = resolveModuleLabel(value);
  return <Badge label={label} accent={resolveModuleColor(label, colors)} />;
}
