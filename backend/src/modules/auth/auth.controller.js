import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const authController = {
    oauthLogin(_req, _res, next) {
        next(notImplemented("Fase 2"));
    },

    emailLogin(_req, _res, next) {
        next(notImplemented("Fase 2"));
    },

    refreshToken(_req, _res, next) {
        next(notImplemented("Fase 2"));
    },

    logout(_req, _res, next) {
        next(notImplemented("Fase 2"));
    },
};
