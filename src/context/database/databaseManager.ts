import { RowDataPacket } from "mysql2";

export abstract class IDatabaseManager {
  static identity: string = "IDatabaseManager";

  abstract getConnection(): void;
  abstract executeQuery(
    query: string,
    values?: (string | number)[]
  ): Promise<RowDataPacket[]>;
}
