import Container from "typedi";
import { IDatabaseManager } from "../context/database/databaseManager";
import { DatabaseManagerImpl } from "../repository/databaseManagerImpl";
import { IUserRepository } from "../context/user/userRepository";
import { UserRepositoryImpl } from "../repository/userRepositoryImpl";
import { IUserService } from "../context/user/userService";
import { UserServiceImpl } from "../application/userServiceImpl";
import { TestUserRepositoryImpl } from "../repository/testUserRepositoryImpl";

/**
 * Dependency Injector
 *
 * Register all interfaces and abstractions here.
 */
export class DependencyInjector {
  /**
   * Register
   */
  static register(mode: string) {
    //#region Higher level registration.
    Container.set(IDatabaseManager.identity, new DatabaseManagerImpl());
    //#end region

    //#region Repository registration.
    switch (mode) {
      case "mysql":
        Container.set(IUserRepository.identity, new UserRepositoryImpl());
        break;
      case "test":
        Container.set(IUserRepository.identity, new TestUserRepositoryImpl());
        break;

      default:
        break;
    }
    //#end region

    //#region Service registration.
    Container.set(IUserService.identity, new UserServiceImpl());
    //#end region
  }
}
