import { notImplemented } from "../../shared/middleware/errorHandler.js";

export const marketplaceController = {
    listOffers(_req, _res, next) {
        next(notImplemented("Fase 10"));
    },

    createOffer(_req, _res, next) {
        next(notImplemented("Fase 10"));
    },

    purchaseOffer(_req, _res, next) {
        next(notImplemented("Fase 10"));
    },
};
