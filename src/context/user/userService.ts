import { BaseUser, BaseUserOptional, UserId } from "../../model/user";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IUserService {
  static identity: string = "IUserService";

  abstract getUsers(): Promise<ApiResponse>;
  abstract getUser(id: UserId): Promise<ApiResponse>;
  abstract createUser(user: BaseUser): Promise<ApiResponse>;
  abstract updateUser(id: UserId, user: BaseUserOptional): Promise<ApiResponse>;
  abstract deleteUser(id: UserId): Promise<ApiResponse>;
}
