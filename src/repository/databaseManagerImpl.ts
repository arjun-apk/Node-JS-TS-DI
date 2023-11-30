import { Service } from "typedi";
import dotenv from "dotenv";
import mysql, { QueryError, RowDataPacket } from "mysql2";
import { IDatabaseManager } from "../context/database/databaseManager";

dotenv.config();

@Service(IDatabaseManager.identity)
export class DatabaseManagerImpl extends IDatabaseManager {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    timezone: "Z",
  });

  getConnection(): void {
    this.connection.connect((err) => {
      if (err) {
        console.info(`Database Connection ${err}`);
        return;
      }
      console.info("Connected to MySQL Database");
    });
  }

  executeQuery(query: string, values?: string[]): Promise<RowDataPacket[]> {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      this.connection.query(
        query,
        values,
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) {
            return reject(`DB ${error}`);
          }
          resolve(results);
        }
      );
    });
  }
}
