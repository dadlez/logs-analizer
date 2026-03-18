# apps/website

React SPA using Feature Sliced Design (FSD). Port 5173.

## Dev

`vp dev` inside apps/website, or `vp run website#dev` from root.
`/api/*` proxied to `http://localhost:3001`.

## Architecture (FSD layers, top → bottom)

```
app/        — router, providers, entry point
pages/      — thin wrappers over widgets
widgets/    — compositions of features + entities
features/   — user interactions (URL params sync)
entities/   — data fetching (TanStack Query)
shared/     — ui/, api/, lib/
```

## Import rule

Each layer imports only from layers **below** it. Cross-layer only via `index.ts` barrel.

## Routing

Code-based TanStack Router in `src/app/router.tsx`. No file-based plugin.
Routes: /explorer, /correlations, /correlations/:id, /domain, /history

## Tests

`vp test` inside apps/website.
MSW handlers: `src/shared/tests/handlers.ts`
Test setup: `src/shared/tests/setup.ts`
Test environment: jsdom (set in vite.config.ts)

## data-testid conventions

nav-bar, nav-explorer, nav-correlations, nav-domain, nav-history
table-selector, filter-bar, filter-module, filter-event-type, filter-date-from, filter-date-to, filter-search
btn-apply-filters, btn-clear-filters, data-table, data-row-{n}, btn-prev-page, btn-next-page
correlations-list, correlation-detail, event-timeline, timeline-item-{n}
module-card-{name}, flow-sequence-{n}, history-table
loading-spinner, error-banner

## Test conventions (BDD)

```ts
it("should [outcome] when [condition]", () => {
  // given
  // when
  // then
});
```
