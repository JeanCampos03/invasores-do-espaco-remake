export const errorHandler = (error, _req, res, _next) => {
    const status = error.status || 501;
    const message = error.message || "Funcionalidade ainda não implementada.";

    res.status(status).json({
        error: message,
        phase: error.phase || null,
    });
};

export const notImplemented = (phase) => {
    const error = new Error("Endpoint reservado para implementação futura.");
    error.status = 501;
    error.phase = phase;
    return error;
};
