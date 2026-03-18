import postgres, {type Sql} from "postgres";

export type DbClient = Sql;

export class Database {
  readonly sql: DbClient;

  constructor(connectionString: string) {
    this.sql = postgres(connectionString, {
      max: 10,
      ssl: "require",
    });
  }
}
