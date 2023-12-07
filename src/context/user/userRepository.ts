import { BaseUser, BaseUserOptional, User, UserId } from "../../model/user";

export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): Promise<User[] | undefined>;
  abstract getUser(id: UserId): Promise<User | undefined>;
  abstract createUser(user: BaseUser): Promise<User | undefined>;
  abstract updateUser(
    id: UserId,
    user: BaseUserOptional
  ): Promise<User | undefined>;
  abstract deleteUser(id: UserId): Promise<string | undefined>;
}
