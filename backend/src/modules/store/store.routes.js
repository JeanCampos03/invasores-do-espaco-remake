import { Router } from "express";
import { storeController } from "./store.controller.js";

const storeRoutes = Router();

storeRoutes.get("/catalog", storeController.getCatalog);
storeRoutes.post("/purchase", storeController.purchase);

export { storeRoutes };
