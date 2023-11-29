import express from "express";
import { UserController } from "../controller/userController";

export class UserRoute {
  router = express.Router();
  userController = new UserController();

  routes() {
    this.router
      .route("/")
      .get(this.userController.getUsers)
      .post(this.userController.createUser);
    this.router
      .route("/:id")
      .get(this.userController.getUser)
      .put(this.userController.updateUser)
      .delete(this.userController.deleteUser);
  }
}
