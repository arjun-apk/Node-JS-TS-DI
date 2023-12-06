import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { AppLogger } from "../utilities/logger";

export class Middleware {
  static logger: Logger = AppLogger.getInstance().getLogger(__filename);

  static authMiddleware(req: Request, res: Response, next: NextFunction) {
    Middleware.logger.info("authMiddleware");
    res.locals = { userId: "abc" };
    next();
  }
}
