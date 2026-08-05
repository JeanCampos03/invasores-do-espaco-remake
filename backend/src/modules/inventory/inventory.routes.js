import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

const inventoryRoutes = Router();

inventoryRoutes.get("/", inventoryController.list);
inventoryRoutes.post("/equip", inventoryController.equip);

export { inventoryRoutes };
