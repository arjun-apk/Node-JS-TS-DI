import { Service } from "typedi";
import { IDatabaseManager } from "../context/database/databaseManager";

@Service(IDatabaseManager.identity)
export class DatabaseManagerImpl extends IDatabaseManager {
  getConnection(): void {
    throw new Error("Method not implemented.");
  }
}
