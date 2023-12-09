import { Container, Service } from "typedi";
import { Logger } from "winston";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import {
  BaseUser,
  BaseUserOptional,
  BaseUserOptionalSchema,
  BaseUserSchema,
  UserId,
  UserIdSchema,
} from "../model/user";
import ApiResponse from "../utilities/apiResponse";
import { AppLogger } from "../logger";
import { UserMessage } from "../const/users/userMessage";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(): Promise<ApiResponse> {
    try {
      this.logger.info(`Method : ${this.getUsers.name}`);
      const users = await this.userRepository.getUsers();
      this.logger.info("Users : " + JSON.stringify(users));
      if (!users) {
        return ApiResponse.conflict();
      }
      return ApiResponse.read(users, UserMessage.success.read);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async getUser(id: UserId): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`
      );
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(
          UserMessage.getErrorMessage(validId.error.issues)
        );
      }
      const user = await this.userRepository.getUser(id);
      this.logger.info("User : " + JSON.stringify(user));
      if (!user) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.read(user, UserMessage.success.read);
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
      const validUser = BaseUserSchema.safeParse(user);
      if (!validUser.success) {
        this.logger.info(JSON.stringify(validUser.error));
        return ApiResponse.badRequest(
          UserMessage.getErrorMessage(validUser.error.issues)
        );
      }
      const newUser = await this.userRepository.createUser(user);
      this.logger.info("New user : " + JSON.stringify(newUser));
      if (!newUser) {
        return ApiResponse.conflict();
      }
      return ApiResponse.created(newUser, UserMessage.success.created);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async updateUser(id: UserId, user: BaseUserOptional): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(
          id
        )}\nUser Details : ${JSON.stringify(user)}`
      );
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(
          UserMessage.getErrorMessage(validId.error.issues)
        );
      }
      const validUser = BaseUserOptionalSchema.safeParse(user);
      if (!validUser.success) {
        this.logger.info(JSON.stringify(validUser.error));
        return ApiResponse.badRequest(
          UserMessage.getErrorMessage(validUser.error.issues)
        );
      }
      const updatedUser = await this.userRepository.updateUser(id, user);
      this.logger.info("Updated user : " + JSON.stringify(updatedUser));
      if (!updatedUser) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.updated(updatedUser, UserMessage.success.updated);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }

  async deleteUser(id: UserId): Promise<ApiResponse> {
    try {
      this.logger.info(
        `Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`
      );
      const validId = UserIdSchema.safeParse(id);
      if (!validId.success) {
        this.logger.info(JSON.stringify(validId.error));
        return ApiResponse.badRequest(
          UserMessage.getErrorMessage(validId.error.issues)
        );
      }
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        this.logger.info(UserMessage.failure.invalidId);
        return ApiResponse.badRequest(UserMessage.failure.invalidId);
      }
      return ApiResponse.deleted(UserMessage.success.deleted);
    } catch (error) {
      this.logger.error(`${error}`);
      return ApiResponse.internalServerError();
    }
  }
}
