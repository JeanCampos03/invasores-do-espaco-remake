import { Router } from "express";
import { rankingController } from "./ranking.controller.js";

const rankingRoutes = Router();

rankingRoutes.get("/:board", rankingController.getLeaderboard);

export { rankingRoutes };
