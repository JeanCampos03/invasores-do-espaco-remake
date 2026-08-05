import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post("/oauth/:provider", authController.oauthLogin);
authRoutes.post("/login", authController.emailLogin);
authRoutes.post("/refresh", authController.refreshToken);
authRoutes.post("/logout", authController.logout);

export { authRoutes };
