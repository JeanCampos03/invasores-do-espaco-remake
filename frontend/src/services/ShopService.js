const API_BASE_URL = "/api";

class ShopService {
    async getCatalog() {
        const response = await fetch(`${API_BASE_URL}/store/catalog`);

        if (!response.ok) {
            throw new Error("Não foi possível carregar o catálogo da loja.");
        }

        return response.json();
    }

    async purchaseItem(itemId, currency) {
        const response = await fetch(`${API_BASE_URL}/store/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, currency }),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || "Falha ao processar compra.");
        }

        return response.json();
    }
}

export default new ShopService();
