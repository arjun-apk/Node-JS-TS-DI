import express, { Router, Request, Response, NextFunction } from "express";
import { Middleware } from "../middlewares/middleware";

export abstract class IBaseController {
  router: Router;
  abstract path: string;
  isProtected: boolean;

  constructor(pIsProtected = true) {
    this.router = express.Router();
    this.isProtected = pIsProtected;
    if (this.isProtected) {
      this.router.use((req: Request, res: Response, next: NextFunction) =>
        new Middleware().authMiddleware(req, res, next)
      );
    }
  }
}
