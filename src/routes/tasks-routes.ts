import { Router } from "express";

import { TasksController } from "@/controllers/tasks-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);

tasksRoutes.post("/", verifyUserAuthorization(["admin"]),  tasksController.create);
tasksRoutes.get("/", verifyUserAuthorization(["admin", "member"]),  tasksController.index);
tasksRoutes.delete("/:task_id/delete", verifyUserAuthorization(["admin", "member"]),  tasksController.delete);
tasksRoutes.put("/:task_id/update", verifyUserAuthorization(["admin"]),  tasksController.updateAdmin);
tasksRoutes.put("/:team_member_id/:task_id/update", verifyUserAuthorization(["admin", "member"]),  tasksController.updateMember);

export { tasksRoutes };