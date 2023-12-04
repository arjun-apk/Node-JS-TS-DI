import { Service } from "typedi";
import dotenv from "dotenv";
import mysql, { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { IDatabaseManager } from "../context/database/databaseManager";
import logger from "../utilities/logger";
import getCurrentFileInfo from "../utilities/getFileInfo";

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
        logger.info(`Database Connection ${err}`);
        return;
      }
      logger.info("Connected to MySQL Database");
    });
  }

  executeGetQuery(query: string, values?: string[]): Promise<RowDataPacket[]> {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      this.connection.query(
        query,
        values,
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) {
            logger.error(`DB ${error}`, { file: getCurrentFileInfo() });
            return reject(`DB ${error}`);
          }
          resolve(results);
        }
      );
    });
  }

  executeRunQuery(query: string, values?: string[]): Promise<ResultSetHeader> {
    return new Promise<ResultSetHeader>((resolve, reject) => {
      this.connection.query(
        query,
        values,
        (error: QueryError | null, results: ResultSetHeader) => {
          if (error) {
            logger.error(`DB ${error}`, { file: getCurrentFileInfo() });
            return reject(`DB ${error}`);
          }
          resolve(results);
        }
      );
    });
  }
}
