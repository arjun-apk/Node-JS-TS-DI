import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DependencyInjector } from "./domain/dependencyInjector";
import { UserRoute } from "./routes/userRoute.";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

const port: number = parseInt(process.env.EXPOSE_PORT as string, 10);
const hostName: string = process.env.IDENTITY_ISSUER_URL as string;

DependencyInjector.register("test");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/users", new UserRoute().routes);

app.listen(port, hostName, () => {
  console.log(`⚡️[server]: Server is running at http://${hostName}:${port}`);
});
