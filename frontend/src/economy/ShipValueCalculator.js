const MARKETPLACE_FEE_RATE = 0.05;

class ShipValueCalculator {
    calculate({ baseValue, upgrades = [], skins = [], equipment = [] }) {
        const upgradeValue = upgrades.reduce((total, upgrade) => total + upgrade.value, 0);
        const skinValue = skins.reduce((total, skin) => total + skin.value, 0);
        const equipmentValue = equipment.reduce(
            (total, item) => total + item.value,
            0
        );

        return baseValue + upgradeValue + skinValue + equipmentValue;
    }
}

export { ShipValueCalculator, MARKETPLACE_FEE_RATE };
