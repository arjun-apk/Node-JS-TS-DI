import { Container, Service } from "typedi";
import { IUserService } from "../context/user/userService";
import { IUserRepository } from "../context/user/userRepository";

@Service(IUserService.identity)
export class UserServiceImpl extends IUserService {
  userRepository: IUserRepository = Container.get(IUserRepository.identity);

  getUsers(): void {
    console.log("UserServiceImpl : getUsers");
    this.userRepository.getUsers();
  }
}
