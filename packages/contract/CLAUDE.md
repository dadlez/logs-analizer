# packages/contract

Shared types and domain enums consumed by both `apps/api` and `apps/website`.

## What belongs here
- API response interfaces
- Domain enums with their label maps (`enums.ts`)
- No runtime logic beyond enum maps and option arrays

## Enums
- `Type`: Added=1, Deleted=2, Modified=3 — action type per log row
- `EntityType`: Unknown=0, ContractHeaderEntity=1, AnnexHeaderEntity=2, AnnexChangeEntity=3, FileEntity=4, InvoiceEntity=5, PaymentScheduleEntity=6, ContractFundingEntity=7

## Usage
Both packages import via workspace protocol:
```json
{ "dependencies": { "contract": "workspace:*" } }
```
Then import: `import { Type, EntityType } from 'contract'`

## Adding new types
1. Add the interface to `src/types.ts`
2. Re-export from `src/index.ts` (already uses `export *`)
3. Rebuild with `vp pack` or `vp pack --watch` in watch mode
