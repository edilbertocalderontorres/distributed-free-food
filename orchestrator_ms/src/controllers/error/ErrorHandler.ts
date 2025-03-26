
import { ServerResponse } from "http";
import { CustomError } from "../../exception/CustomError";
import { ErrorDto } from "../dto/ErrorDto";
export function manejarError(res: ServerResponse, error: any): void {
    let mensaje = "Error interno del servidor";
    let codigoHttp = 500;
    let errorCause = error;

    if (error instanceof CustomError) {
        mensaje = error.message;
        codigoHttp = error.statusCode || 500;
        errorCause = error.error || "";
    }

    res.writeHead(codigoHttp, { "Content-Type": "application/json" });
    res.end(JSON.stringify(new ErrorDto(errorCause, mensaje)));
}