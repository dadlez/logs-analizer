import Stack from "@mui/material/Stack";
import { Badge } from "./Badge.tsx";

interface BadgePillListProps {
  labels: string[];
  resolveAccent: (label: string) => string;
}

export function BadgePillList({ labels, resolveAccent }: BadgePillListProps) {
  return (
    <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
      {labels.map((label) => (
        <Badge key={label} label={label} accent={resolveAccent(label)} />
      ))}
    </Stack>
  );
}
