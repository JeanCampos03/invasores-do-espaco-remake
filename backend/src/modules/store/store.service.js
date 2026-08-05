const AVAILABLE_SKINS = [
    {
        id: "skin-default",
        name: "Padrão",
        description: "Sem mudanças visuais. A skin inicial do jogador.",
        price: 0,
        tint: "#ffffff",
        image: "src/assets/images/spaceship.png",
    },
    {
        id: "skin-green",
        name: "Verde",
        description: "Uma nave verde vibrante.",
        price: 100,
        tint: "#54ff6a",
        image: "src/assets/images/skins/skin-green.png",
    },
    {
        id: "skin-red",
        name: "Vermelha",
        description: "Uma nave com visual vermelho intenso.",
        price: 150,
        tint: "#ff6a54",
        image: "src/assets/images/skins/skin-red.png",
    },
    {
        id: "skin-blue",
        name: "Azul",
        description: "Uma nave com tom azul gélido.",
        price: 180,
        tint: "#54a8ff",
        image: "src/assets/images/skins/skin-blue.png",
    },
    {
        id: "skin-yellow",
        name: "Amarela",
        description: "Uma nave amarela brilhante.",
        price: 200,
        tint: "#ffe354",
        image: "src/assets/images/skins/skin-yellow.png",
    },
];

const purchases = new Set(["skin-default"]);

class StoreService {
    async getCatalog() {
        return { catalog: AVAILABLE_SKINS };
    }

    async purchase(itemId) {
        const item = AVAILABLE_SKINS.find((skin) => skin.id === itemId);

        if (!item) {
            const error = new Error("Skin não encontrada.");
            error.status = 404;
            throw error;
        }

        if (purchases.has(itemId)) {
            const error = new Error("Skin já comprada.");
            error.status = 400;
            throw error;
        }

        purchases.add(itemId);
        return { success: true, itemId, price: item.price };
    }
}

export default new StoreService();
