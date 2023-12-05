import express, { Router } from "express";
import { UserController } from "../controller/userController";

export class UserRoute {
  router: Router;
  userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();

    this.router
      .route("/")
      .get((req, res) => this.userController.getUsers(req, res))
      .post((req, res) => this.userController.createUser(req, res));

    this.router
      .route("/:id")
      .get((req, res) => this.userController.getUser(req, res))
      .put((req, res) => this.userController.updateUser(req, res))
      .delete((req, res) => this.userController.deleteUser(req, res));
  }
}
