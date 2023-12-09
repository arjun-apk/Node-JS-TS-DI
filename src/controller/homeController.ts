import { Request, Response } from "express";
import { IBaseController } from "./baseController";
import { Logger } from "winston";
import { AppLogger } from "../logger";

export class HomeController extends IBaseController {
  path: string = "/";
  logger: Logger = AppLogger.getInstance().getLogger(__filename);

  constructor() {
    super(false);
    this.router.route(this.path).get((req, res) => this.homePage(req, res));
  }

  homePage(req: Request, res: Response) {
    this.logger.info("homePage");
    res.send("Express + TypeScript Server");
  }
}
