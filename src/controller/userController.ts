import { Request, Response } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { IUserService } from "../context/user/userService";
import { AppLogger } from "../utilities/logger";
import { IBaseController } from "./baseController";

export class UserController extends IBaseController {
  path: string = "/users";
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userService: IUserService = Container.get(IUserService.identity);
  functionName: any;

  constructor() {
    super();
    this.router
      .route(this.path)
      .get((req, res) => this.getUsers(req, res))
      .post((req, res) => this.createUser(req, res));
    this.router
      .route(this.path + "/:id")
      .get((req, res) => this.getUser(req, res))
      .put((req, res) => this.updateUser(req, res))
      .delete((req, res) => this.deleteUser(req, res));
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    this.logger.info(`Method : ${this.getUsers.name}`);
    const result = await this.userService.getUsers();
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.getUser.name}\nParams : ${JSON.stringify(req.params.id)}`
    );
    const id = Number(req.params.id);
    const result = await this.userService.getUser(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.createUser.name}\nRequest body : ${JSON.stringify(
        req.body
      )}`
    );
    const result = await this.userService.createUser(req.body);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.updateUser.name}\nParams : ${JSON.stringify(
        req.params.id
      )}\nRequest body : ${JSON.stringify(req.body)}`
    );
    const id = Number(req.params.id);
    const result = await this.userService.updateUser(id, req.body);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    this.logger.info(
      `Method : ${this.deleteUser.name}\nParams : ${JSON.stringify(
        req.params.id
      )}`
    );
    const id = Number(req.params.id);
    this.logger.info(`Request body : ${JSON.stringify(req.body)}`);
    const result = await this.userService.deleteUser(id);
    this.logger.info(`Response body : ${JSON.stringify(result)}`);
    res.status(result.resultCode).json(result);
  }
}
