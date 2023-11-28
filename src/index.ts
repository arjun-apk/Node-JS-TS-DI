import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UserController } from "./controller/userController";
import { DependencyInjector } from "./domain/dependencyInjector";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

DependencyInjector.register("test");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/test", (req: Request, res: Response) => {
  const userController = new UserController();
  userController.getUsers();
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
