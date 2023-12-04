import { Request, Response } from "express";
import Container from "typedi";
import { IUserService } from "../context/user/userService";
import { AppLogger } from "../utilities/logger";
import { Logger } from "winston";

export class UserController {
  userService: IUserService = Container.get(IUserService.identity);
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  async getUsers(req: Request, res: Response): Promise<void> {
    this.logger.info("UserController : getUsers");
    const result = await this.userService.getUsers();
    res.status(result.resultCode).json(result);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    this.logger.info("UserController : getUser");
    const id = Number(req.params.id);
    const result = await this.userService.getUser(id);
    res.status(result.resultCode).json(result);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    this.logger.info("UserController : createUser");
    const result = await this.userService.createUser(req.body);
    res.status(result.resultCode).json(result);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    this.logger.info("UserController : updateUser");
    const id = Number(req.params.id);
    const result = await this.userService.updateUser(id, req.body);
    res.status(result.resultCode).json(result);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    this.logger.info("UserController : deleteUser");
    const id = Number(req.params.id);
    const result = await this.userService.deleteUser(id);
    res.status(result.resultCode).json(result);
  }
}
