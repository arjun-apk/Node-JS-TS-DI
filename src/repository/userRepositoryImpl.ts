import Container, { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, BaseUserOptional, User } from "../model/user";
import { IDatabaseManager } from "../context/database/databaseManager";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";

class UserQuery {
  tableName = "users";
  userId = "UserId";
  name = "Name";
  age = "Age";
  DateOfBirth = "DateOfBirth";

  findAll(): string {
    return `SELECT * FROM ${this.tableName}`;
  }
  findById(id: number): string {
    return `SELECT * FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
  }
  create(name: string, age: number, dateOfBirth: string): string {
    return `INSERT INTO ${this.tableName} (${this.name}, ${this.age}, ${this.DateOfBirth})
            VALUES ('${name}', ${age}, '${dateOfBirth}')`;
  }
  update(name: string, age: number, dateOfBirth: string, id: number): string {
    return `UPDATE ${this.tableName}
            SET ${this.name} = '${name}', ${this.age} = ${age}, ${this.DateOfBirth} = '${dateOfBirth}'
            WHERE ${this.userId} = ${id}`;
  }
  delete(id: number): string {
    return `DELETE FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
  }
}

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userQuery = new UserQuery();

  convertPascalToCamelCase(rows: RowDataPacket[]): User[] {
    return rows.map((row) => ({
      userId: row.UserId,
      name: row.Name,
      age: row.Age,
      dateOfBirth: row.DateOfBirth,
    }));
  }

  async getUsers(): Promise<User[]> {
    this.logger.info("getUsers");
    const rows = await this.database.executeGetQuery(this.userQuery.findAll());
    const users: User[] = this.convertPascalToCamelCase(rows);
    return users;
  }

  async getUser(id: number): Promise<User | undefined> {
    this.logger.info("getUser");
    const rows = await this.database.executeGetQuery(
      this.userQuery.findById(id)
    );
    const user: User = this.convertPascalToCamelCase(rows)[0];
    return user;
  }

  async createUser(user: BaseUser): Promise<User | undefined> {
    this.logger.info("createUser");
    const { name, age, dateOfBirth } = user;
    const result = await this.database.executeRunQuery(
      this.userQuery.create(name, age, dateOfBirth)
    );
    if (result.insertId > 0) {
      const newUser = await this.getUser(result.insertId);
      if (newUser) {
        return newUser;
      }
    }
  }

  async updateUser(
    id: number,
    user: BaseUserOptional
  ): Promise<User | undefined> {
    this.logger.info("updateUser");
    const { name, age, dateOfBirth } = user;
    const userDetails = await this.getUser(id);
    if (!userDetails) {
      return userDetails;
    }
    const result = await this.database.executeRunQuery(
      this.userQuery.update(
        name || userDetails.name,
        age || userDetails.age,
        dateOfBirth || userDetails.dateOfBirth,
        id
      )
    );
    if (result.affectedRows > 0) {
      const updatedUser = await this.getUser(id);
      if (updatedUser) {
        return updatedUser;
      }
    }
  }

  async deleteUser(id: number): Promise<string | undefined> {
    this.logger.info("deleteUser");
    const result = await this.database.executeRunQuery(
      this.userQuery.delete(id)
    );
    if (result.affectedRows > 0) {
      return "User deleted successfully";
    }
  }
}
