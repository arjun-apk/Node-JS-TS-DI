import { Request, Response } from "express";
import Container from "typedi";
import { IUserService } from "../context/user/userService";

export class UserController {
  userService: IUserService = Container.get(IUserService.identity);

  getUsers(req: Request, res: Response): void {
    console.log("UserController : getUsers");
    const result = this.userService.getUsers();
    res.status(200).json(result);
  }

  getUser(req: Request, res: Response): void {
    console.log("UserController : getUser");
    const id = Number(req.params.id);
    const result = this.userService.getUser(id);
    res.status(200).json(result);
  }

  createUser(req: Request, res: Response): void {
    console.log("UserController : createUser");
    const result = this.userService.createUser(req.body);
    res.status(200).json(result);
  }

  updateUser(req: Request, res: Response): void {
    console.log("UserController : updateUser");
    const id = Number(req.params.id);
    const result = this.userService.updateUser(id, req.body);
    res.status(200).json(result);
  }

  deleteUser(req: Request, res: Response): void {
    console.log("UserController : deleteUser");
    const id = Number(req.params.id);
    const result = this.userService.deleteUser(id);
    res.status(200).json(result);
  }
}
