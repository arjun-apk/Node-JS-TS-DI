import express, { Express, Router, Request, Response } from "express";
import { Logger } from "winston";
import { UserController } from "./controller/userController";
import { AppLogger } from "./utilities/logger";
import { Middleware } from "./middlewares/middleware";

export class Routes {
  app: Express;
  router: Router;
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  userController: UserController;

  constructor(app: Express) {
    this.app = app;
    this.router = express.Router();
    this.userController = new UserController();
  }

  route() {
    this.logger.info("route");
    //Home route
    this.router.get("/", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    // User routes
    this.router = this.userController.routes();

    this.app.use(Middleware.authMiddleware, this.router);
  }
}
