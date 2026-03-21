import Chip from "@mui/material/Chip";

interface BadgeProps {
  label: string;
  accent: string;
}

export function Badge({ label, accent }: BadgeProps) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{ backgroundColor: accent, color: "#fff", fontWeight: 500 }}
    />
  );
}
