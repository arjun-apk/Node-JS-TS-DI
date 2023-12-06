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
    try {
      this.logger.info(`Method : ${this.getUsers.name}`);
      const users = await this.userRepository.getUsers();
      this.logger.info("Users : " + JSON.stringify(users));
      return ApiResponse.read(users);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: number): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`
      );
      const user = await this.userRepository.getUser(id);
      this.logger.info("User : " + JSON.stringify(user));
      if (!user) {
        this.logger.info("Invalid user id");
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.read(user);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async createUser(user: BaseUser): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.createUser.name}\nUser Details : ${JSON.stringify(
          user
        )}`
      );
      const { name, age, dateOfBirth } = user;
      const isValidDetails = [name, age, dateOfBirth].every(
        (each: string | number) => each !== undefined
      );
      if (!isValidDetails) {
        this.logger.info("Invalid user details: " + JSON.stringify(user));
        return ApiResponse.badRequest("Invalid details");
      }
      const newUser = await this.userRepository.createUser(user);
      this.logger.info("New user : " + JSON.stringify(newUser));
      if (!newUser) {
        this.logger.info("New user is undefined");
        return ApiResponse.badRequest();
      }
      return ApiResponse.created(newUser);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateUser(id: number, user: BaseUserOptional): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(
          id
        )}\nUser Details : ${JSON.stringify(user)}`
      );
      const { name, age, dateOfBirth } = user;
      const isValidDetails = [name, age, dateOfBirth].some(
        (each: string | number | undefined) => each !== undefined
      );
      if (!isValidDetails) {
        this.logger.info("Invalid user details: " + JSON.stringify(user));
        return ApiResponse.badRequest("Invalid details");
      }
      const updatedUser = await this.userRepository.updateUser(id, user);
      this.logger.info("Updated user : " + JSON.stringify(updatedUser));
      if (!updatedUser) {
        this.logger.info("Invalid user id");
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.updated(updatedUser);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`
      );
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        this.logger.info("Invalid user id");
        return ApiResponse.badRequest("Invalid id");
      }
      return ApiResponse.deleted();
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
