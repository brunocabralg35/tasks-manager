import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(verifyUserAuthorization(["admin"]));

teamsRoutes.get("/", teamsController.index);
teamsRoutes.post("/", teamsController.create);
teamsRoutes.put("/:id", teamsController.update);
teamsRoutes.post("/member/:id/:user_id", teamsController.addMember);
teamsRoutes.delete("/member/:id/:user_id", teamsController.removeMember);

export { teamsRoutes };
