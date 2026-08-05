import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const rankingController = {
    getLeaderboard(_req, _res, next) {
        next(notImplemented("Fase 12"));
    },
};
