export default class TokenDestroyedError extends Error {

    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
