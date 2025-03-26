export class CustomError extends Error {
    message: string;
    statusCode?: number;
    error?: string;
    constructor(message: string, statusCode: number, error: string) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}



