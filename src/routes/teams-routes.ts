import { Router } from "express";

import { TeamsController } from "@/controllers/teams-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated);

teamsRoutes.post("/", verifyUserAuthorization(["admin"]), teamsController.create);
teamsRoutes.get("/", teamsController.index);
teamsRoutes.get("/:id/show", teamsController.show);
teamsRoutes.put("/:id/update", verifyUserAuthorization(["admin"]), teamsController.update);

export { teamsRoutes };