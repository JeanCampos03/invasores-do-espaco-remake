import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const inventoryController = {
    list(_req, _res, next) {
        next(notImplemented("Fase 6"));
    },

    equip(_req, _res, next) {
        next(notImplemented("Fase 6"));
    },
};
