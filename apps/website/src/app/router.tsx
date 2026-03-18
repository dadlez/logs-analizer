import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
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
  validateSearch: zodValidator(
    z.object({
      table: z.string().default(""),
      module: z.string().default(""),
      event_type: z.string().default(""),
      correlation_id: z.string().default(""),
      from: z.string().default(""),
      to: z.string().default(""),
      search: z.string().default(""),
      page: z.number().default(1),
      sort_col: z.string().default(""),
      sort_dir: z.enum(["asc", "desc"]).default("desc"),
    }),
  ),
  component: ExplorerPage,
});

const correlationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlations",
  validateSearch: zodValidator(
    z.object({
      table: z.string().default(""),
      module: z.string().default(""),
      from: z.string().default(""),
      to: z.string().default(""),
      page: z.number().default(1),
    }),
  ),
  component: CorrelationsPage,
});

const correlationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlations/$id",
  validateSearch: zodValidator(z.object({ table: z.string().default("") })),
  component: CorrelationDetailPage,
});

const domainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domain",
  validateSearch: zodValidator(z.object({ table: z.string().default("") })),
  component: DomainPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  validateSearch: zodValidator(
    z.object({
      table: z.string().default(""),
      page: z.number().default(1),
      from: z.string().default(""),
      to: z.string().default(""),
      user_email: z.string().default(""),
      action_type: z.number().optional(),
    }),
  ),
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
