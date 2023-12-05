import { Request, Response, NextFunction } from "express";

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware");
  const isValidUser = true;
  res.locals = { userId: "123321" };
  next();
};

export default authMiddleWare;
