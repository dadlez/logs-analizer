import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export function LoadingSpinner() {
  return (
    <Box
      data-testid="loading-spinner"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}
    >
      <CircularProgress />
    </Box>
  );
}
