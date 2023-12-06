import "source-map-support/register";
import express, { Express, Request, Response } from "express";
import { Logger } from "winston";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { DependencyInjector } from "./domain/dependencyInjector";
import { AppLogger } from "./utilities/logger";
import { IBaseController } from "./controller/baseController";
import { HomeController } from "./controller/homeController";
import { UserController } from "./controller/userController";

dotenv.config();

const logger: Logger = AppLogger.getInstance().getLogger(__filename);

export const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

morgan.token("fullUrl", (req: Request, res: Response) => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
});

morgan.token("body", (req: Request, res: Response) => {
  let body = req.body;
  if (Object.keys(body).length === 0) {
    return "";
  }
  return JSON.stringify(body);
});

app.use(
  morgan(
    ":method Request :fullUrl :body :status Response length :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message: string) => {
          logger.info(`${message.trim()}\n${"-".repeat(100)}`);
        },
      },
    }
  )
);

const port: number = parseInt(process.env.EXPOSE_PORT as string, 10);
const hostName: string = process.env.IDENTITY_ISSUER_URL as string;
const dependencyInjectorMode: string = process.env
  .DEPENDENCY_INJECTOR_MODE as string;

DependencyInjector.register(dependencyInjectorMode);

const controllers: IBaseController[] = [
  new HomeController(),
  new UserController(),
];
controllers.forEach((each: IBaseController) => {
  logger.info(
    `Path: "${each.path}" is ${each.isProtected ? "" : "not"} protected`
  );
  app.use("/", each.router);
});

app.listen(port, hostName, () => {
  logger.info(`⚡️[server]: Server is running at http://${hostName}:${port}`);
});
