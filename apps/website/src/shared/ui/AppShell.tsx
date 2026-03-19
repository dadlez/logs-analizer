import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { NavBar } from "./NavBar.tsx";

const DRAWER_WIDTH = 200;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Logs Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "none",
            boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
          },
        }}
      >
        <Toolbar />
        <NavBar />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 8, ml: `${DRAWER_WIDTH}px` }}>
        {children}
      </Box>
    </Box>
  );
}
