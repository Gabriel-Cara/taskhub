import { Router } from "express";

import { TeamMembersController } from "@/controllers/team-members-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { verify } from "crypto";

const teamMembersRoutes = Router();
const teamMembersController = new TeamMembersController();

teamMembersRoutes.use(ensureAuthenticated);

teamMembersRoutes.post("/", verifyUserAuthorization(["admin"]), teamMembersController.add);
teamMembersRoutes.delete("/:id/delete", verifyUserAuthorization(["admin"]), teamMembersController.exclude);
teamMembersRoutes.get("/", teamMembersController.index);
teamMembersRoutes.get("/:user_id/show", teamMembersController.show);

export { teamMembersRoutes };