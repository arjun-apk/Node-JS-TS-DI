import { Service } from "typedi";
import { IUserRepository } from "../context/user/userRepository";

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  getUsers(): void {
    console.log("UserRepositoryImpl : getUsers");
  }
}
