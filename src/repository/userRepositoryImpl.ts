import Container, { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, User } from "../model/user";
import { IDatabaseManager } from "../context/database/databaseManager";

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
  userQuery = new UserQuery();

  async getUsers(): Promise<User[]> {
    console.log("UserRepositoryImpl : getUsers");
    const rows = await this.database.executeGetQuery(this.userQuery.findAll());
    const users: User[] = rows.map((row) => ({
      userId: row.UserId,
      name: row.Name,
      age: row.Age,
      dateOfBirth: row.DateOfBirth,
    }));
    return users;
  }

  async getUser(id: number): Promise<User | undefined> {
    console.log("UserRepositoryImpl : getUser");
    const rows = await this.database.executeGetQuery(
      this.userQuery.findById(id)
    );
    const user: User = rows.map((row) => ({
      userId: row.UserId,
      name: row.Name,
      age: row.Age,
      dateOfBirth: row.DateOfBirth,
    }))[0];
    return user;
  }

  async createUser(user: BaseUser): Promise<User | undefined> {
    console.log("UserRepositoryImpl : createUser");
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

  async updateUser(id: number, user: BaseUser): Promise<User | undefined> {
    console.log("UserRepositoryImpl : updateUser");
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
    console.log("UserRepositoryImpl : deleteUser");
    const result = await this.database.executeRunQuery(
      this.userQuery.delete(id)
    );
    if (result.affectedRows > 0) {
      return "User deleted successfully";
    }
  }
}
