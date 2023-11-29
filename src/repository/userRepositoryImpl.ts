import { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  private data: User[] = [];

  getUsers(): User[] {
    console.log("UserRepositoryImpl : getUsers");
    return this.data;
  }

  getUser(id: number): User | string {
    console.log("UserRepositoryImpl : getUser");
    return this.data.find((each: User) => each.id == id) || "User not found";
  }

  createUser(user: User): string {
    console.log("UserRepositoryImpl : createUser");
    this.data.push(user);
    console.log(this.data);
    return "User created successfully";
  }

  updateUser(id: number, user: User): string {
    console.log("UserRepositoryImpl : updateUser");
    const index = this.data.findIndex((each: User) => each.id == id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...user };
      return "User updated successfully";
    }
    return "User not found";
  }

  deleteUser(id: number): string {
    console.log("UserRepositoryImpl : deleteUser");
    const index = this.data.findIndex((each: User) => each.id == id);
    if (index !== -1) {
      this.data = this.data.filter((each: User) => each.id !== id);
      return "User deleted successfully";
    }
    return "User not found";
  }
}
