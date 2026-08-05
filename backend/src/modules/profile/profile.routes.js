import { Router } from "express";
import { profileController } from "./profile.controller.js";

const profileRoutes = Router();

profileRoutes.get("/me", profileController.getProfile);
profileRoutes.get("/statistics", profileController.getStatistics);

export { profileRoutes };
