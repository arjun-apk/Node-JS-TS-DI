import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";
import ApiResponse from "../utilities/apiResponse";
import logger from "../utilities/logger";
import getCurrentFileInfo from "../utilities/getFileInfo";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  async getUsers(): Promise<ApiResponse> {
    logger.info("UserServiceImpl : getUsers");
    try {
      const users = await this.userRepository.getUsers();
      return ApiResponse.read(users);
    } catch (error) {
      logger.error(`${error}`, { file: getCurrentFileInfo() });
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: number): Promise<ApiResponse> {
    logger.info("UserServiceImpl : getUser");
    try {
      const user = await this.userRepository.getUser(id);
      if (!user) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.read(user);
    } catch (error) {
      logger.error(`${error}`, { file: getCurrentFileInfo() });
      return ApiResponse.internalServerError();
    }
  }

  async createUser(user: User): Promise<ApiResponse> {
    logger.info("UserServiceImpl : createUser");
    try {
      const newUser = await this.userRepository.createUser(user);
      if (!newUser) {
        return ApiResponse.badRequest();
      }
      return ApiResponse.created(newUser);
    } catch (error) {
      logger.error(`${error}`, { file: getCurrentFileInfo() });
      return ApiResponse.internalServerError();
    }
  }

  async updateUser(id: number, user: User): Promise<ApiResponse> {
    logger.info("UserServiceImpl : updateUser");
    try {
      const updatedUser = await this.userRepository.updateUser(id, user);
      if (!updatedUser) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.updated(updatedUser);
    } catch (error) {
      logger.error(`${error}`, { file: getCurrentFileInfo() });
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    logger.info("UserServiceImpl : deleteUser");
    try {
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        return ApiResponse.badRequest("User not found");
      }
      return ApiResponse.deleted(user);
    } catch (error) {
      logger.error(`${error}`, { file: getCurrentFileInfo() });
      return ApiResponse.internalServerError();
    }
  }
}
