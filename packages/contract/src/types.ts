import type { EntityType, Type } from "./enums.ts";

// Schema
export interface SchemaColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
}

export interface SchemaTable {
  table_name: string;
  row_count: number;
  columns: SchemaColumn[];
}

export type SchemaResponse = SchemaTable[];

// Logs
export interface LogRow {
  [key: string]: unknown;
}

export interface LogsResponse {
  data: LogRow[];
  total: number;
  page: number;
  limit: number;
}

// Correlations
export interface CorrelationSummary {
  correlation_id: string;
  event_count: number;
  modules: string[];
  started_at: string;
  ended_at: string;
  duration_ms: number;
}

export interface CorrelationsResponse {
  data: CorrelationSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CorrelationEvent {
  [key: string]: unknown;
}

export interface CorrelationDetailResponse {
  correlation_id: string;
  events: CorrelationEvent[];
  modules: string[];
  event_types: string[];
  flow: string[];
}

// Analytics
export interface ModuleAnalytics {
  module: string;
  event_count: number;
  event_types: string[];
  unique_correlations: number;
}

export interface EventTypeAnalytics {
  event_type: string;
  count: number;
  modules: string[];
  avg_position: number;
}

export interface FlowAnalytics {
  flow: string[];
  count: number;
}

export interface TimelineBucket {
  bucket: string;
  event_count: number;
}

// History
export interface HistoryEntry {
  correlation_id: string;
  user_email: string;
  action_type: Type;
  contract_number: string | null;
  started_at: string;
  duration_ms: number;
  entity_count: number;
  entity_types: EntityType[];
}

export interface HistoryResponse {
  data: HistoryEntry[];
  total: number;
  page: number;
  limit: number;
}
