import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, BaseUserOptional } from "../model/user";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../utilities/logger";
import { Logger } from "winston";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(): Promise<ApiResponse> {
    this.logger.info("getUsers");
    try {
      const users = await this.userRepository.getUsers();
      return ApiResponse.read(users);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: number): Promise<ApiResponse> {
    this.logger.info("getUser");
    try {
      const user = await this.userRepository.getUser(id);
      if (!user) {
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.read(user);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createUser(user: BaseUser): Promise<ApiResponse> {
    this.logger.info("createUser");
    try {
      const { name, age, dateOfBirth } = user;
      const isValidDetails = [name, age, dateOfBirth].every(
        (each: string | number) => each !== undefined
      );
      if (!isValidDetails) {
        return ApiResponse.badRequest("Invalid details");
      }
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

  async updateUser(id: number, user: BaseUserOptional): Promise<ApiResponse> {
    this.logger.info("updateUser");
    try {
      const { name, age, dateOfBirth } = user;
      const isValidDetails = [name, age, dateOfBirth].some(
        (each: string | number | undefined) => each !== undefined
      );
      if (!isValidDetails) {
        return ApiResponse.badRequest("Invalid details");
      }
      const updatedUser = await this.userRepository.updateUser(id, user);
      if (!updatedUser) {
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.updated(updatedUser);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    this.logger.info("deleteUser");
    try {
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.deleted();
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
