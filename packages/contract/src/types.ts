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
  id: number;
  organization_id: string;
  user_id: string;
  user_email: string;
  type: Type;
  entity_type: EntityType;
  created_date: string;
  old_values: string | null;
  new_values: string | null;
  affected_columns: string | null;
  primary_key: string | null;
  entity_id: string;
  parent_id: string | null;
  correlation_id: string;
  sub_unit_id: string | null;
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
  type: Type;
  entity_type: EntityType;
  created_date: string;
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
  entity_type: number;
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

export interface CooccurrenceEntry {
  module_a: number;
  module_b: number;
  count: number;
}

export interface CascadePattern {
  pattern: string[];
  count: number;
  avg_duration_ms: number;
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
