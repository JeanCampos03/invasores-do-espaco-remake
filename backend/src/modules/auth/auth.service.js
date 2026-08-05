export class AuthService {
    async loginWithProvider(_provider, _token) {
        throw notImplemented("Fase 2");
    }
}

function notImplemented(phase) {
    const error = new Error("Serviço de autenticação não implementado.");
    error.status = 501;
    error.phase = phase;
    return error;
}
