import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

type ColorKey = keyof Theme["palette"]["colors"];

const ROUTE_COLORS: Record<string, { accent: ColorKey; lightBg: string }> = {
  "/explorer": { accent: "purple", lightBg: "#F3EAFF" },
  "/correlations": { accent: "cyan", lightBg: "#E0F9FF" },
  "/domain": { accent: "mint", lightBg: "#E6FBF6" },
  "/history": { accent: "orange", lightBg: "#FFF3EC" },
};

const explorerItems = [{ to: "/explorer", label: "Explorer", testId: "nav-explorer" }] as const;

const analysisItems = [
  { to: "/correlations", label: "Correlations", testId: "nav-correlations" },
  { to: "/domain", label: "Domain", testId: "nav-domain" },
  { to: "/history", label: "History", testId: "nav-history" },
] as const;

function NavItem({
  to,
  label,
  testId,
  currentPath,
  accent,
  lightBg,
}: {
  to: string;
  label: string;
  testId: string;
  currentPath: string;
  accent: string;
  lightBg: string;
}) {
  const selected = currentPath.startsWith(to);
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={to}
        selected={selected}
        data-testid={testId}
        sx={
          selected
            ? {
                mx: 1,
                borderLeft: `3px solid ${accent}`,
                borderRadius: "0 6px 6px 0",
                backgroundColor: lightBg,
                color: accent,
                fontWeight: 600,
                "&:hover": { backgroundColor: lightBg },
                "& .MuiListItemText-primary": { fontWeight: 600 },
              }
            : {
                mx: 1,
                borderRadius: 1,
              }
        }
      >
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

export function NavBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const theme = useTheme();

  return (
    <List data-testid="nav-bar" disablePadding>
      {explorerItems.map((item) => {
        const rc = ROUTE_COLORS[item.to];
        return (
          <NavItem
            key={item.to}
            {...item}
            currentPath={currentPath}
            accent={theme.palette.colors[rc.accent]}
            lightBg={rc.lightBg}
          />
        );
      })}
      <Divider sx={{ my: 1 }} />
      {analysisItems.map((item) => {
        const rc = ROUTE_COLORS[item.to];
        return (
          <NavItem
            key={item.to}
            {...item}
            currentPath={currentPath}
            accent={theme.palette.colors[rc.accent]}
            lightBg={rc.lightBg}
          />
        );
      })}
    </List>
  );
}
