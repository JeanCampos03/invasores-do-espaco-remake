import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const economyController = {
    getWallet(_req, _res, next) {
        next(notImplemented("Fase 4"));
    },

    getTransactions(_req, _res, next) {
        next(notImplemented("Fase 4"));
    },
};
