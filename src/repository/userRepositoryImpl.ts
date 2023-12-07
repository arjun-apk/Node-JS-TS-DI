import Container, { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, BaseUserOptional, User, UserId } from "../model/user";
import { IDatabaseManager } from "../context/database/databaseManager";
import { RowDataPacket } from "mysql2";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";
import { UserQuery } from "../const/users/userQuery";

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

  async getUsers(): Promise<User[] | undefined> {
    this.logger.info(`Method : ${this.getUsers.name}`);
    const rows = await this.database.executeGetQuery(this.userQuery.findAll());
    this.logger.info("Result : " + JSON.stringify(rows));
    if (rows !== undefined) {
      const users: User[] = this.convertPascalToCamelCase(rows);
      return users;
    }
  }

  async getUser(id: UserId): Promise<User | undefined> {
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
    id: UserId,
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

  async deleteUser(id: UserId): Promise<string | undefined> {
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
