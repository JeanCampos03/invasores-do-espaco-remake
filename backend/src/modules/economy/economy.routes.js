import { Router } from "express";
import { economyController } from "./economy.controller.js";

const economyRoutes = Router();

economyRoutes.get("/wallet", economyController.getWallet);
economyRoutes.get("/transactions", economyController.getTransactions);

export { economyRoutes };
