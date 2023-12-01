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
    const rows = await this.database.executeQuery(this.userQuery.findAll());
    const users: User[] = rows.map((row) => ({
      userId: row.UserId,
      name: row.Name,
      age: row.Age,
      dateOfBirth: row.DateOfBirth,
    }));
    return users;
  }

  async getUser(id: number): Promise<User | string> {
    console.log("UserRepositoryImpl : getUser");
    const rows = await this.database.executeQuery(this.userQuery.findById(id));
    const user: User = rows.map((row) => ({
      userId: row.UserId,
      name: row.Name,
      age: row.Age,
      dateOfBirth: row.DateOfBirth,
    }))[0];
    return user || "User not found";
  }

  async createUser(user: BaseUser): Promise<string> {
    console.log("UserRepositoryImpl : createUser");
    const { name, age, dateOfBirth } = user;
    await this.database.executeQuery(
      this.userQuery.create(name, age, dateOfBirth)
    );
    return "User created successfully";
  }

  async updateUser(id: number, user: BaseUser): Promise<string> {
    console.log("UserRepositoryImpl : updateUser");
    const { name, age, dateOfBirth } = user;
    await this.database.executeQuery(
      this.userQuery.update(name, age, dateOfBirth, id)
    );
    return "User updated successfully";
  }

  async deleteUser(id: number): Promise<string> {
    console.log("UserRepositoryImpl : deleteUser");
    await this.database.executeQuery(this.userQuery.delete(id));
    return "User deleted successfully";
  }
}
