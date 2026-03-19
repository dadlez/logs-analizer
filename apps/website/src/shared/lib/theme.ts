import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#6A1B9A",
    },
    background: {
      default: "#F8F9FB",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    body2: { letterSpacing: "0.01em" },
    caption: { letterSpacing: "0.02em" },
    subtitle2: { letterSpacing: "0.015em" },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          transition: "background-color 150ms ease, color 150ms ease, box-shadow 150ms ease",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: "background-color 150ms ease",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { transition: "background-color 100ms ease" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 4px rgba(0,0,0,0.08), 0px 0px 1px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "0px 1px 4px rgba(0,0,0,0.12)" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(0,0,0,0.06)" },
      },
    },
  },
});
