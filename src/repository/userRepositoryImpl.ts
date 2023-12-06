import Container, { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, BaseUserOptional, User } from "../model/user";
import { IDatabaseManager } from "../context/database/databaseManager";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";

class UserQuery {
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
  findById(id: number): string {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
    this.logger.info(`Find user by id query : ${query}`);
    return query;
  }
  create(name: string, age: number, dateOfBirth: string): string {
    const query = `INSERT INTO ${this.tableName} (${this.name}, ${this.age}, ${this.DateOfBirth}) VALUES ('${name}', ${age}, '${dateOfBirth}')`;
    this.logger.info(`Create user query : ${query}`);
    return query;
  }
  update(name: string, age: number, dateOfBirth: string, id: number): string {
    const query = `UPDATE ${this.tableName} SET ${this.name} = '${name}', ${this.age} = ${age}, ${this.DateOfBirth} = '${dateOfBirth}' WHERE ${this.userId} = ${id}`;
    this.logger.info(`Update user query : ${query}`);
    return query;
  }
  delete(id: number): string {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.userId} = ${id}`;
    this.logger.info(`Delete user query : ${query}`);
    return query;
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
    this.logger.info(`Method : ${this.getUsers.name}`);
    const rows = await this.database.executeGetQuery(this.userQuery.findAll());
    this.logger.info("Result : " + JSON.stringify(rows));
    const users: User[] = this.convertPascalToCamelCase(rows);
    return users;
  }

  async getUser(id: number): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`
    );
    const rows = await this.database.executeGetQuery(
      this.userQuery.findById(id)
    );
    this.logger.info("Result : " + JSON.stringify(rows));
    const user: User = this.convertPascalToCamelCase(rows)[0];
    return user;
  }

  async createUser(user: BaseUser): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.createUser.name}\nUser details: ${JSON.stringify(user)}`
    );
    const { name, age, dateOfBirth } = user;
    const result = await this.database.executeRunQuery(
      this.userQuery.create(name, age, dateOfBirth)
    );
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.insertId > 0) {
      const newUser = await this.getUser(result.insertId);
      this.logger.info(`New User: ${JSON.stringify(newUser)}`);
      if (newUser) {
        return newUser;
      }
    }
  }

  async updateUser(
    id: number,
    user: BaseUserOptional
  ): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(
        id
      )}\nUser details: ${JSON.stringify(user)}`
    );
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
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows > 0) {
      const updatedUser = await this.getUser(id);
      this.logger.info(`Updated User: ${JSON.stringify(updatedUser)}`);
      if (updatedUser) {
        return updatedUser;
      }
    }
  }

  async deleteUser(id: number): Promise<string | undefined> {
    this.logger.info(
      `Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`
    );
    const result = await this.database.executeRunQuery(
      this.userQuery.delete(id)
    );
    this.logger.info("Result : " + JSON.stringify(result));
    if (result.affectedRows > 0) {
      return "User deleted successfully";
    }
  }
}
