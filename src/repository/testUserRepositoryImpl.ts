import { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";
import { BaseUser, BaseUserOptional, User } from "../model/user";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";

@Service(IUserRepository.identity)
export class TestUserRepositoryImpl extends IUserRepository {
  data: User[] = [
    {
      userId: 1,
      name: "Arjun P",
      age: 22,
      dateOfBirth: "2001-04-03T18:30:00.000Z",
    },
    {
      userId: 2,
      name: "APK",
      age: 23,
      dateOfBirth: "2001-04-03T18:30:00.000Z",
    },
  ];
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(): Promise<User[]> {
    this.logger.info("TestUserRepositoryImpl : getUsers");
    return this.data;
  }

  async getUser(id: number): Promise<User | undefined> {
    this.logger.info("TestUserRepositoryImpl : getUser");
    return this.data.find((each: User) => each.userId === id);
  }

  async createUser(user: BaseUser): Promise<User | undefined> {
    this.logger.info("TestUserRepositoryImpl : createUser");
    const userId: number = this.data.length + 1;
    const newUser: User = { userId, ...user };
    this.data.push(newUser);
    return newUser;
  }

  async updateUser(
    id: number,
    user: BaseUserOptional
  ): Promise<User | undefined> {
    this.logger.info("TestUserRepositoryImpl : updateUser");
    const { name, age, dateOfBirth } = user;
    const userDetails = await this.getUser(id);
    if (!userDetails) {
      return userDetails;
    }
    const updateUser: User = {
      userId: id,
      name: name || userDetails.name,
      age: age || userDetails.age,
      dateOfBirth: dateOfBirth || userDetails.dateOfBirth,
    };
    this.data = this.data.map((each: User) => {
      if (each.userId === id) {
        return updateUser;
      }
      return each;
    });
    return updateUser;
  }

  async deleteUser(id: number): Promise<string | undefined> {
    this.logger.info("TestUserRepositoryImpl : deleteUser");
    const userDetails = await this.getUser(id);
    if (!userDetails) {
      return userDetails;
    }
    this.data = this.data.filter((each: User) => each.userId !== id);
    return "User deleted successfully";
  }
}
