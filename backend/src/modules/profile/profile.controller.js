import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const profileController = {
    getProfile(_req, _res, next) {
        next(notImplemented("Fase 2"));
    },

    getStatistics(_req, _res, next) {
        next(notImplemented("Fase 12"));
    },
};
