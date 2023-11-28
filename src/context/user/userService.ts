export abstract class IUserService {
  static identity: string = "IUserService";

  abstract getUsers(): void;
}
