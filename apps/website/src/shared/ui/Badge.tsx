import Chip from "@mui/material/Chip";

interface BadgeProps {
  label: string;
  variant?: "module" | "event-type";
}

export function Badge({ label, variant = "module" }: BadgeProps) {
  return <Chip label={label} size="small" color={variant === "module" ? "primary" : "secondary"} />;
}
