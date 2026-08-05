const API_BASE_URL = "/api";

class AuthService {
    async loginWithProvider(provider) {
        throw new Error(`Autenticação via ${provider} será implementada na Fase 2.`);
    }

    async loginWithEmail(email, password) {
        throw new Error("Autenticação por e-mail será implementada na Fase 2.");
    }

    async logout() {
        throw new Error("Logout será implementado na Fase 2.");
    }

    async refreshToken() {
        throw new Error("Refresh token será implementado na Fase 2.");
    }

    getApiBaseUrl() {
        return API_BASE_URL;
    }
}

export default new AuthService();
