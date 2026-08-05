import { env } from "./env.js";

export const databaseConfig = {
    url: env.databaseUrl,
    ssl: env.nodeEnv === "production",
};
