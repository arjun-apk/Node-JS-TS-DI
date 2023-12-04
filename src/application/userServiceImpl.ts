import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../utilities/logger";
import { Logger } from "winston";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(): Promise<ApiResponse> {
    this.logger.info("UserServiceImpl : getUsers");
    try {
      const users = await this.userRepository.getUsers();
      return ApiResponse.read(users);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: number): Promise<ApiResponse> {
    this.logger.info("UserServiceImpl : getUser");
    try {
      const user = await this.userRepository.getUser(id);
      if (!user) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.read(user);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createUser(user: User): Promise<ApiResponse> {
    this.logger.info("UserServiceImpl : createUser");
    try {
      const newUser = await this.userRepository.createUser(user);
      if (!newUser) {
        return ApiResponse.badRequest();
      }
      return ApiResponse.created(newUser);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateUser(id: number, user: User): Promise<ApiResponse> {
    this.logger.info("UserServiceImpl : updateUser");
    try {
      const updatedUser = await this.userRepository.updateUser(id, user);
      if (!updatedUser) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.updated(updatedUser);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    this.logger.info("UserServiceImpl : deleteUser");
    try {
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.deleted(user);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
