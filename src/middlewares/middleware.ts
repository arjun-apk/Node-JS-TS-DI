import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";

export class Middleware {
  static logger: Logger = AppLogger.getInstance().getLogger(__filename);

  userId: number | undefined;
  companyId: number | undefined;

  authMiddleware(req: Request, res: Response, next: NextFunction) {
    Middleware.logger.info("authMiddleware");
    //Temporary initialized user id and company id
    this.userId = 1000;
    this.companyId = 2000;
    res.locals = { userId: this.userId, companyId: this.companyId };
    next();
  }
}
