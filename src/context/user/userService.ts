import { BaseUser, BaseUserOptional } from "../../model/user";
import ApiResponse from "../../utilities/apiResponse";

export abstract class IUserService {
  static identity: string = "IUserService";

  abstract getUsers(): Promise<ApiResponse>;
  abstract getUser(id: number): Promise<ApiResponse>;
  abstract createUser(user: BaseUser): Promise<ApiResponse>;
  abstract updateUser(id: number, user: BaseUserOptional): Promise<ApiResponse>;
  abstract deleteUser(id: number): Promise<ApiResponse>;
}
