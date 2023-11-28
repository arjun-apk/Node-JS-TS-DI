import Container from "typedi";
import { IUserService } from "../context/user/userService";

export class UserController {
  userService: IUserService = Container.get(IUserService.identity);

  getUsers(): void {
    console.log("UserController : getUsers");
    this.userService.getUsers();
  }
}
