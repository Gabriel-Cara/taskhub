import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.get("/", usersController.index);
usersRoutes.post("/", usersController.create);
usersRoutes.patch("/:id/update", usersController.update);

export { usersRoutes };