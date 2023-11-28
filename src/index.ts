import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UserController } from "./controller/userController";
import { DependencyInjector } from "./domain/dependencyInjector";
import { User } from "./repository/userRepositoryImpl";

dotenv.config();

const app: Express = express();

const port: number = parseInt(process.env.EXPOSE_PORT as string, 10);
const hostName: string = process.env.IDENTITY_ISSUER_URL as string;
const nodeEnvironment: string = process.env.NODE_ENV as string;
const appVersion: string = process.env.NODE_ENV as string;

DependencyInjector.register("test");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/users", (req: Request, res: Response) => {
  const userController = new UserController();
  userController.getUsers();
  res.send("Express + TypeScript Server");
});

app.listen(port, hostName, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
