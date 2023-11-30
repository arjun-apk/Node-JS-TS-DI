import Container, { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, User } from "../model/user";
import { IDatabaseManager } from "../context/database/databaseManager";

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  private data: User[] = [];
  database: IDatabaseManager = Container.get(IDatabaseManager.identity);

  async getUsers(): Promise<User[]> {
    console.log("UserRepositoryImpl : getUsers");
    const rows = await this.database.executeQuery("SELECT * FROM users");
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
    const rows = await this.database.executeQuery(
      "SELECT * FROM users WHERE userId = ?",
      [id]
    );
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
      "INSERT INTO users (Name, Age, DateOfBirth) VALUES (?, ?, ?)",
      [name, age, dateOfBirth]
    );
    return "User created successfully";
  }

  async updateUser(id: number, user: BaseUser): Promise<string> {
    console.log("UserRepositoryImpl : updateUser");
    const { name, age, dateOfBirth } = user;
    await this.database.executeQuery(
      "UPDATE users SET Name = ?, Age = ?, DateOfBirth = ? WHERE UserId = ?",
      [name, age, dateOfBirth, id]
    );
    return "User updated successfully";
  }

  async deleteUser(id: number): Promise<string> {
    console.log("UserRepositoryImpl : deleteUser");
    await this.database.executeQuery("DELETE FROM users WHERE UserId = ?", [
      id,
    ]);
    return "User deleted successfully";
  }
}
