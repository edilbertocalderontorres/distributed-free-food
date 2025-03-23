export class CustomError extends Error {
    message: string;
    statusCode?: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}



