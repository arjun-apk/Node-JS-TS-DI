import { Request, Response } from "express";
import Container from "typedi";
import { IUserService } from "../context/user/userService";

export class UserController {
  userService: IUserService = Container.get(IUserService.identity);

  async getUsers(req: Request, res: Response): Promise<void> {
    console.log("UserController : getUsers");
    const result = await this.userService.getUsers();
    res.status(200).json(result);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    console.log("UserController : getUser");
    const id = Number(req.params.id);
    const result = await this.userService.getUser(id);
    res.status(200).json(result);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    console.log("UserController : createUser");
    const result = await this.userService.createUser(req.body);
    res.status(200).json(result);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    console.log("UserController : updateUser");
    const id = Number(req.params.id);
    const result = await this.userService.updateUser(id, req.body);
    res.status(200).json(result);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    console.log("UserController : deleteUser");
    const id = Number(req.params.id);
    const result = await this.userService.deleteUser(id);
    res.status(200).json(result);
  }
}
