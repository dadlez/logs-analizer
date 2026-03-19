import { z } from "zod";

export const explorerSearchParams = z.object({
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
});

export const correlationsSearchParams = z.object({
  table: z.string().default(""),
  module: z.string().default(""),
  from: z.string().default(""),
  to: z.string().default(""),
  page: z.number().default(1),
});

export const correlationDetailSearchParams = z.object({
  table: z.string().default(""),
});

export const domainSearchParams = z.object({
  table: z.string().default(""),
});

export const historySearchParams = z.object({
  table: z.string().default(""),
  page: z.number().default(1),
  from: z.string().default(""),
  to: z.string().default(""),
  user_email: z.string().default(""),
  action_type: z.number().optional(),
});

export type ExplorerSearchParams = z.infer<typeof explorerSearchParams>;
export type CorrelationsSearchParams = z.infer<typeof correlationsSearchParams>;
export type CorrelationDetailSearchParams = z.infer<typeof correlationDetailSearchParams>;
export type DomainSearchParams = z.infer<typeof domainSearchParams>;
export type HistorySearchParams = z.infer<typeof historySearchParams>;
