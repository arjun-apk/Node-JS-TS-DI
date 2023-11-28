export abstract class IUserRepository {
  static identity: string = "IUserRepository";

  abstract getUsers(): void;
}
