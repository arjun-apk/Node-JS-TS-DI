import { Service } from "typedi";
import dotenv from "dotenv";
import mysql, { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { IDatabaseManager } from "../context/database/databaseManager";
import { AppLogger } from "../utilities/logger";
import { Logger } from "winston";

dotenv.config();

@Service(IDatabaseManager.identity)
export class DatabaseManagerImpl extends IDatabaseManager {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    timezone: "Z",
  });

  getConnection(): void {
    this.logger.info(`Method : ${this.getConnection.name}`);
    this.connection.connect((err) => {
      if (err) {
        this.logger.info(`Database Connection ${err}`);
        return;
      }
      this.logger.info("Connected to MySQL Database");
    });
  }

  executeGetQuery(query: string, values?: string[]): Promise<RowDataPacket[]> {
    this.logger.info(`Method : ${this.executeGetQuery.name}`);
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      this.connection.query(
        query,
        values,
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) {
            this.logger.error(`DB ${error}`);
            return reject(`DB ${error}`);
          }
          resolve(results);
        }
      );
    });
  }

  executeRunQuery(query: string, values?: string[]): Promise<ResultSetHeader> {
    this.logger.info(`Method : ${this.executeRunQuery.name}`);
    return new Promise<ResultSetHeader>((resolve, reject) => {
      this.connection.query(
        query,
        values,
        (error: QueryError | null, results: ResultSetHeader) => {
          if (error) {
            this.logger.error(`DB ${error}`);
            return reject(`DB ${error}`);
          }
          resolve(results);
        }
      );
    });
  }
}
