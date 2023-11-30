import { User } from "../../model/user";

export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): Promise<User[]>;
  abstract getUser(id: number): Promise<User | string>;
  abstract createUser(user: User): Promise<string>;
  abstract updateUser(id: number, user: User): Promise<string>;
  abstract deleteUser(id: number): Promise<string>;
}
