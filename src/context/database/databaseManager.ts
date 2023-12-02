import { OkPacket, RowDataPacket } from "mysql2";

export abstract class IDatabaseManager {
  static identity: string = "IDatabaseManager";

  abstract getConnection(): void;
  abstract executeGetQuery(
    query: string,
    values?: (string | number)[]
  ): Promise<RowDataPacket[]>;
  abstract executeRunQuery(
    query: string,
    values?: (string | number)[]
  ): Promise<OkPacket>;
}
