import { MARKETPLACE_FEE_RATE } from "../economy/ShipValueCalculator.js";

class Marketplace {
    calculateSaleProceeds(price) {
        const fee = Math.floor(price * MARKETPLACE_FEE_RATE);
        const proceeds = price - fee;

        return { price, fee, proceeds };
    }
}

export default Marketplace;
