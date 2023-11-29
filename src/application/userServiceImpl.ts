import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";
import { User } from "../model/user";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  getUsers(): User[] {
    console.log("UserServiceImpl : getUsers");
    return this.userRepository.getUsers();
  }

  getUser(id: number): User | string {
    console.log("UserServiceImpl : getUser");
    return this.userRepository.getUser(id);
  }

  createUser(user: User): string {
    console.log("UserServiceImpl : createUser");
    return this.userRepository.createUser(user);
  }

  updateUser(id: number, user: User): string {
    console.log("UserServiceImpl : updateUser");
    return this.userRepository.updateUser(id, user);
  }

  deleteUser(id: number): string {
    console.log("UserServiceImpl : deleteUser");
    return this.userRepository.deleteUser(id);
  }
}
