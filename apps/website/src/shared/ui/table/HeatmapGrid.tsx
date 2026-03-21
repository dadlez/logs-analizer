import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

interface HeatmapGridProps {
  labels: string[];
  getValue: (row: string, col: string) => number;
  formatLabel?: (label: string) => string;
  getTooltip?: (row: string, col: string, count: number) => string;
  formatCell?: (value: number) => string;
}

export function HeatmapGrid({
  labels,
  getValue,
  formatLabel,
  getTooltip,
  formatCell = (v) => (v > 0 ? String(v) : ""),
}: HeatmapGridProps) {
  const allCounts = labels.flatMap((row) => labels.map((col) => getValue(row, col)));
  const maxCount = Math.max(...allCounts, 1);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ borderCollapse: "collapse", fontSize: 12, minWidth: 480 }}>
        <thead>
          <tr>
            <Box component="th" sx={{ p: 0.5, minWidth: 80 }} />
            {labels.map((label) => (
              <Box
                key={label}
                component="th"
                sx={{
                  p: 0.5,
                  textAlign: "center",
                  fontWeight: 600,
                  minWidth: 60,
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  maxWidth: 70,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Tooltip title={label}>
                  <span>{formatLabel ? formatLabel(label) : label}</span>
                </Tooltip>
              </Box>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((rowLabel) => (
            <tr key={rowLabel}>
              <Box
                component="td"
                sx={{
                  p: 0.5,
                  fontWeight: 600,
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  textAlign: "right",
                  pr: 1,
                }}
              >
                {formatLabel ? formatLabel(rowLabel) : rowLabel}
              </Box>
              {labels.map((colLabel) => {
                const isDiagonal = rowLabel === colLabel;
                const count = isDiagonal ? 0 : getValue(rowLabel, colLabel);
                const intensity = count > 0 ? Math.round((count / maxCount) * 220) : 0;
                const bg = isDiagonal
                  ? "rgba(0,0,0,0.05)"
                  : count > 0
                    ? `rgba(25, 118, 210, ${(intensity / 255).toFixed(2)})`
                    : "transparent";
                const textColor =
                  intensity > 130 ? "#fff" : count > 0 ? "inherit" : "text.disabled";
                const tooltip = getTooltip
                  ? getTooltip(rowLabel, colLabel, count)
                  : count > 0
                    ? `${rowLabel} ↔ ${colLabel}: ${count}`
                    : "";
                return (
                  <Tooltip key={colLabel} title={isDiagonal ? "" : tooltip}>
                    <Box
                      component="td"
                      sx={{
                        p: 0.5,
                        textAlign: "center",
                        bgcolor: bg,
                        color: textColor,
                        border: "1px solid",
                        borderColor: "divider",
                        fontWeight: count > 0 ? 600 : 400,
                        transition: "opacity 0.1s",
                        "&:hover": count > 0 ? { opacity: 0.8 } : {},
                      }}
                    >
                      {formatCell(count)}
                    </Box>
                  </Tooltip>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}
