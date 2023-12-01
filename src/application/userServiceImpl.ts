import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  async getUsers(): Promise<User[]> {
    console.log("UserServiceImpl : getUsers");
    return await this.userRepository.getUsers();
  }

  getUser(id: number): Promise<User | string> {
    console.log("UserServiceImpl : getUser");
    return this.userRepository.getUser(id);
  }

  createUser(user: User): Promise<string> {
    console.log("UserServiceImpl : createUser");
    return this.userRepository.createUser(user);
  }

  updateUser(id: number, user: User): Promise<string> {
    console.log("UserServiceImpl : updateUser");
    return this.userRepository.updateUser(id, user);
  }

  deleteUser(id: number): Promise<string> {
    console.log("UserServiceImpl : deleteUser");
    return this.userRepository.deleteUser(id);
  }
}
