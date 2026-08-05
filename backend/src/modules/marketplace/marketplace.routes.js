import { Router } from "express";
import { marketplaceController } from "./marketplace.controller.js";

const marketplaceRoutes = Router();

marketplaceRoutes.get("/offers", marketplaceController.listOffers);
marketplaceRoutes.post("/offers", marketplaceController.createOffer);
marketplaceRoutes.post("/offers/:id/purchase", marketplaceController.purchaseOffer);

export { marketplaceRoutes };
