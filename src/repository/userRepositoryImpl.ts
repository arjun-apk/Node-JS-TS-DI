import { IUserRepository } from "../context/user/userRepository";
import { Service } from "typedi";

@Service(IUserRepository.identity)
export class UserRepositoryImpl extends IUserRepository {
  getUsers(): void {
    console.log("UserRepositoryImpl : getUsers");
  }
}
