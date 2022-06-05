class APIError {
    constructor(success, code, message) {
        this.success = success;
        this.code = code,
            this.message = message
    }

    static badRequest(msg) {
        return new APIError(false, 400, msg);
    }

    static unauthorized(msg) {
        return new APIError(false, 401, msg);
    }

    static notFound(msg) {
        return new APIError(false, 404, msg);
    }

    static conflict(msg) {
        return new APIError(false, 409, msg);
    }

    static internal(msg) {
        return new APIError(false, 500, msg);
    }
}

module.exports = APIError;