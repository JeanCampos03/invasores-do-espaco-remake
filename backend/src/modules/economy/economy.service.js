const MARKETPLACE_FEE_RATE = 0.05;

export class EconomyService {
    calculateShipValue({ baseValue, upgrades = [], skins = [], equipment = [] }) {
        const upgradeValue = upgrades.reduce((total, item) => total + item.value, 0);
        const skinValue = skins.reduce((total, item) => total + item.value, 0);
        const equipmentValue = equipment.reduce(
            (total, item) => total + item.value,
            0
        );

        return baseValue + upgradeValue + skinValue + equipmentValue;
    }

    calculateMarketplaceProceeds(price) {
        const fee = Math.floor(price * MARKETPLACE_FEE_RATE);
        return { price, fee, proceeds: price - fee };
    }
}
