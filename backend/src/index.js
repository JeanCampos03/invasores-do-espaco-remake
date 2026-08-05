import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { economyRoutes } from "./modules/economy/economy.routes.js";
import { storeRoutes } from "./modules/store/store.routes.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";
import { marketplaceRoutes } from "./modules/marketplace/marketplace.routes.js";
import { profileRoutes } from "./modules/profile/profile.routes.js";
import { rankingRoutes } from "./modules/ranking/ranking.routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../../frontend");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "space-invaders-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/economy", economyRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ranking", rankingRoutes);

app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

app.listen(env.port, () => {
    console.log(`Space Invaders API running on port ${env.port}`);
    console.log(`Serving frontend from ${frontendPath}`);
});
