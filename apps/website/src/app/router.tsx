import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  correlationDetailSearchParams,
  correlationsSearchParams,
  domainSearchParams,
  explorerSearchParams,
  historySearchParams,
} from "contract";
import { AppShell } from "../shared/ui";
import { ExplorerPage } from "../pages/ExplorerPage.tsx";
import { CorrelationsPage } from "../pages/CorrelationsPage.tsx";
import { CorrelationDetailPage } from "../pages/CorrelationDetailPage.tsx";
import { DomainPage } from "../pages/DomainPage.tsx";
import { HistoryPage } from "../pages/HistoryPage.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/explorer" } as never);
  },
});

const explorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explorer",
  validateSearch: zodValidator(explorerSearchParams),
  component: ExplorerPage,
});

const correlationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlations",
  validateSearch: zodValidator(correlationsSearchParams),
  component: CorrelationsPage,
});

const correlationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlations/$id",
  validateSearch: zodValidator(correlationDetailSearchParams),
  component: CorrelationDetailPage,
});

const domainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domain",
  validateSearch: zodValidator(domainSearchParams),
  component: DomainPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  validateSearch: zodValidator(historySearchParams),
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  explorerRoute,
  correlationsRoute,
  correlationDetailRoute,
  domainRoute,
  historyRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
