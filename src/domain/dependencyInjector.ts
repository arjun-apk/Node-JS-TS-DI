import Container from "typedi";
import { IDatabaseManager } from "../context/database/databaseManager";
import { DatabaseManagerImpl } from "../repository/databaseManagerImpl";
import { IUserRepository } from "../context/user/userRepository";
import { UserRepositoryImpl } from "../repository/userRepositoryImpl";
import { IUserService } from "../context/user/userService";
import { UserServiceImpl } from "../application/userServiceImpl";
import { TestUserRepositoryImpl } from "../repository/testUserRepositoryImpl";
import { Logger } from "winston";
import { AppLogger } from "../logger";

/**
 * Dependency Injector
 *
 * Register all interfaces and abstractions here.
 */
export class DependencyInjector {
  static logger: Logger = AppLogger.getInstance().getLogger(__filename);
  /**
   * Register
   */
  static register(mode: string) {
    DependencyInjector.logger.info("Dependency Injector Mode : " + mode);
    //#region Higher level registration.
    Container.set(IDatabaseManager.identity, new DatabaseManagerImpl());
    //#end region

    //#region Repository registration.
    switch (mode) {
      case "mysql":
        const database: IDatabaseManager = Container.get(
          IDatabaseManager.identity
        );
        database.getConnection();
        Container.set(IUserRepository.identity, new UserRepositoryImpl());
        break;
      case "test":
        Container.set(IUserRepository.identity, new TestUserRepositoryImpl());
        break;

      default:
        DependencyInjector.logger.info(
          "Invalid Dependency Injector Mode : " + mode
        );
        break;
    }
    //#end region

    //#region Service registration.
    Container.set(IUserService.identity, new UserServiceImpl());
    //#end region
  }
}
