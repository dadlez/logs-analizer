<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

## Project: Logs Analyzer

A monorepo for analyzing PostgreSQL audit logs and discovering the domain behind them.

### Packages

- `apps/api` — Fastify backend, port 3001
- `apps/website` — React SPA (FSD), port 5173
- `packages/contract` — Shared types + domain enums (consumed by both)

### Dev

Run `vp run api#dev website#dev` from root (or `cd apps/api && vp dev` / `cd apps/website && vp dev` individually).

### Important: contract package

`packages/contract` must be built before tests run: `cd packages/contract && vp pack`

### Domain enums (packages/contract/src/enums.ts)

- `Type`: Added=1, Deleted=2, Modified=3
- `EntityType`: Unknown=0, ContractHeaderEntity=1, AnnexHeaderEntity=2, AnnexChangeEntity=3, FileEntity=4, InvoiceEntity=5, PaymentScheduleEntity=6, ContractFundingEntity=7

### Implementation Status

- ✅ Phase A — Monorepo wiring (catalog, packages/contract)
- ✅ Phase B — apps/api skeleton + DB + health endpoint
- ✅ Phase C — GET /api/schema
- ✅ Phase D — All API routes (logs, correlations, analytics, history)
- ✅ Phase F — apps/website setup + shared layer
- ✅ Phase G — entities/ (schema, log, correlation, domain, history)
- ✅ Phase H — features/ (select-table, filter-logs, view-correlation)
- ✅ Phase I — widgets/ (LogsBrowser, Correlations, EventTimeline, DomainDashboard, ActivityHistory)
- ✅ Phase J — pages/ + app/ + routing

### Tests

- API: `cd apps/api && vp test` (31 tests)
- Website: `cd apps/website && vp test` (9 tests)

### Database Schema

Two tables discovered via `GET /api/schema`:

**`audit_log`** (2926 rows) — main audit log
| Column | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `organization_id` | uuid | |
| `user_id` | uuid | |
| `user_email` | varchar | |
| `type` | integer | `Type` enum: Added=1, Deleted=2, Modified=3 |
| `entity_type` | integer | `EntityType` enum |
| `created_date` | timestamp | Event timestamp (NOT `created_at`) |
| `old_values` / `new_values` | text | JSON payloads |
| `affected_columns` | text | |
| `primary_key` | varchar | Entity's PK (contract number for entity_type=1) |
| `entity_id` | uuid | |
| `parent_id` | uuid | |
| `correlation_id` | uuid | Groups related events |
| `sub_unit_id` | uuid | |

**`document_header`** (547 rows) — contract/annex reference
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `number` | varchar | Document number |
| `document_type` | smallint | 1=ContractHeader, 2=AnnexHeader |
| `parent_id` | uuid | Links annexes to contracts |
| `organization_id` | uuid | |
| `created_date` / `deleted_date` | timestamp | |

### Column mapping (API params → DB columns)

| API/frontend concept                 | DB column                                 |
| ------------------------------------ | ----------------------------------------- |
| `module` filter                      | `entity_type` (integer, cast `::integer`) |
| `event_type` filter                  | `type` (integer, cast `::integer`)        |
| `action_type` (history)              | `type`                                    |
| `contract_number` (history response) | `primary_key` CASE WHEN entity_type=1     |
