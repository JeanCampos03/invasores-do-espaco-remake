import storeService from "./store.service.js";

export const storeController = {
    async getCatalog(_req, res, next) {
        try {
            const catalog = await storeService.getCatalog();
            res.json(catalog);
        } catch (error) {
            next(error);
        }
    },

    async purchase(req, res, next) {
        try {
            const { itemId } = req.body;
            const result = await storeService.purchase(itemId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
