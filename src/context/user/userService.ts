import { User } from "../../model/user";

export abstract class IUserService {
  static identity: string = "IUserService";

  abstract getUsers(): User[];
  abstract getUser(id: number): User | string;
  abstract createUser(user: User): string;
  abstract updateUser(id: number, user: User): string;
  abstract deleteUser(id: number): string;
}
