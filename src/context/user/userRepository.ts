import { User } from "../../model/user";

export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): Promise<User[]>;
  abstract getUser(id: number): Promise<User | undefined>;
  abstract createUser(user: User): Promise<User | undefined>;
  abstract updateUser(id: number, user: User): Promise<User | undefined>;
  abstract deleteUser(id: number): Promise<string | undefined>;
}
