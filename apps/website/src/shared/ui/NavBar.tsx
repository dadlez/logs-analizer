import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { to: "/explorer", label: "Explorer", testId: "nav-explorer" },
  { to: "/correlations", label: "Correlations", testId: "nav-correlations" },
  { to: "/domain", label: "Domain", testId: "nav-domain" },
  { to: "/history", label: "History", testId: "nav-history" },
] as const;

export function NavBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <List data-testid="nav-bar" disablePadding>
      {navItems.map((item) => (
        <ListItem key={item.to} disablePadding>
          <ListItemButton
            component={Link}
            to={item.to}
            selected={currentPath.startsWith(item.to)}
            data-testid={item.testId}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
