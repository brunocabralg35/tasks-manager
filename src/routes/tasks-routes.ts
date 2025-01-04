import { Router } from "express";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { TasksController } from "@/controllers/tasks-controller";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);

tasksRoutes.get(
  "/:team_id",
  verifyUserAuthorization(["admin", "member"]),
  tasksController.index
);
tasksRoutes.post(
  "/:team_id",
  verifyUserAuthorization(["admin"]),
  tasksController.create
);
tasksRoutes.patch(
  "/:id",
  verifyUserAuthorization(["admin", "member"]),
  tasksController.update
);
tasksRoutes.delete(
  "/:id",
  verifyUserAuthorization(["admin"]),
  tasksController.delete
);

export { tasksRoutes };
