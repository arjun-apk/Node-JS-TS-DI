import "source-map-support/register";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DependencyInjector } from "./domain/dependencyInjector";
import { UserRoute } from "./routes/userRoute.";
import { IDatabaseManager } from "./context/database/databaseManager";
import Container from "typedi";
import { AppLogger } from "./utilities/logger";
import { Logger } from "winston";

dotenv.config();

const logger: Logger = AppLogger.getInstance().getLogger(__filename);

export const app: Express = express();
app.use(bodyParser.json());

const port: number = parseInt(process.env.EXPOSE_PORT as string, 10);
const hostName: string = process.env.IDENTITY_ISSUER_URL as string;

DependencyInjector.register("test");

const database: IDatabaseManager = Container.get(IDatabaseManager.identity);
database.getConnection();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/users", new UserRoute().router);

app.listen(port, hostName, () => {
  logger.info(`⚡️[server]: Server is running at http://${hostName}:${port}`);
});
