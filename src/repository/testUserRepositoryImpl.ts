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
    this.logger.info(`Method : ${this.getUsers.name}`);
    const users = this.data;
    this.logger.info(`Users : ${JSON.stringify(users)}`);
    return users;
  }

  async getUser(id: number): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.getUser.name}\nUser id: ${JSON.stringify(id)}`
    );
    const user = this.data.find((each: User) => each.userId === id);
    this.logger.info(`User : ${JSON.stringify(user)}`);
    return user;
  }

  async createUser(user: BaseUser): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.createUser.name}\nUser details: ${JSON.stringify(user)}`
    );
    const userId: number = this.data.length + 1;
    const newUser: User = { userId, ...user };
    this.logger.info(`New User: ${JSON.stringify(newUser)}`);
    this.data.push(newUser);
    return newUser;
  }

  async updateUser(
    id: number,
    user: BaseUserOptional
  ): Promise<User | undefined> {
    this.logger.info(
      `Method : ${this.updateUser.name}\nUser id: ${JSON.stringify(
        id
      )}\nUser details: ${JSON.stringify(user)}`
    );
    const { name, age, dateOfBirth } = user;
    const userDetails = await this.getUser(id);
    if (!userDetails) {
      return userDetails;
    }
    const updatedUser: User = {
      userId: id,
      name: name || userDetails.name,
      age: age || userDetails.age,
      dateOfBirth: dateOfBirth || userDetails.dateOfBirth,
    };
    this.logger.info(`Updated User: ${JSON.stringify(updatedUser)}`);
    this.data = this.data.map((each: User) => {
      if (each.userId === id) {
        return updatedUser;
      }
      return each;
    });
    return updatedUser;
  }

  async deleteUser(id: number): Promise<string | undefined> {
    this.logger.info(
      `Method : ${this.deleteUser.name}\nUser id: ${JSON.stringify(id)}`
    );
    const userDetails = await this.getUser(id);
    if (!userDetails) {
      return userDetails;
    }
    this.data = this.data.filter((each: User) => each.userId !== id);
    this.logger.info("User deleted successfully");
    return "User deleted successfully";
  }
}
