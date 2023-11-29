import { User } from "../../model/user";

export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): User[];
  abstract getUser(id: number): User | string;
  abstract createUser(user: User): string;
  abstract updateUser(id: number, user: User): string;
  abstract deleteUser(id: number): string;
}
