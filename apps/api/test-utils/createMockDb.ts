import { vi } from "vite-plus/test";
import type { Mock } from "vite-plus/test";

import type { DbClient } from "../src/db";

export type MockDb = DbClient & { unsafe: Mock };

export function createMockDb(): MockDb {
  return Object.assign(vi.fn().mockResolvedValue([]), {
    unsafe: vi.fn().mockResolvedValue([]),
  }) as unknown as MockDb;
}
