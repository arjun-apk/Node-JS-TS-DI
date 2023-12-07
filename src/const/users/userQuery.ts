import { Logger } from "winston";
import { AppLogger } from "../../utilities/logger";
import { UserId } from "../../model/user";

export class UserQuery {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  tableName = "users";
  userId = "UserId";
  name = "Name";
  age = "Age";
  DateOfBirth = "DateOfBirth";

  findAll(): string {
    const query = `SELECT * FROM ${this.tableName}`;
    this.logger.info(`Find all users query : ${query}`);
    return query;
  }
  findById(id: UserId): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
    this.logger.info(`Find user by id query : ${query}`);
    return query;
  }
  create(name: string, age: number, dateOfBirth: string): string {
    const query = `INSERT INTO ${this.tableName} (${this.name}, ${this.age}, ${this.DateOfBirth}) VALUES ('${name}', ${age}, '${dateOfBirth}')`;
    this.logger.info(`Create user query : ${query}`);
    return query;
  }
  update(name: string, age: number, dateOfBirth: string, id: UserId): string {
    const query = `UPDATE ${this.tableName} SET ${this.name} = '${name}', ${this.age} = ${age}, ${this.DateOfBirth} = '${dateOfBirth}' WHERE ${this.userId} = ${id}`;
    this.logger.info(`Update user query : ${query}`);
    return query;
  }
  delete(id: UserId): string {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
    this.logger.info(`Delete user query : ${query}`);
    return query;
  }
}
