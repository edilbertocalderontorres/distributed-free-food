

import { Post } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { manejarOrden } from '../services/OrdenService';
import { Beneficiario, Orden, EstadoOrden } from '../models/models';
import { CustomError } from "../exception/CustomError";
import { ErrorDto } from "./dto/ErrorDto";
import { suscribirActualizacionEstado } from "../services/ManejaEventoEstadoOrdenService";
export class OrdenController {

    constructor() {
        
    }

    @Post("/orden")
    public async manejarOrden(req: IncomingMessage, res: ServerResponse): Promise<void> {
        let body = "";
        const clientid = req.headers["x-clientid"] as string;

        req.on("data", (chunk) => {
            body += chunk.toString();

        });
        let container: Beneficiario;
        let orden: Orden;


        req.on("end", async () => {
            try {
                container = JSON.parse(body);


                orden = {
                    id: "",
                    beneficiarioid: container.beneficiario.tipodocumento.concat(container.beneficiario.numdocumento),
                    recetaid: null,
                    estado: "PENDIENTE" as EstadoOrden,
                    fechacreacion: new Date(),
                    fechaactualizacion: new Date()
                };
                const resultado = await manejarOrden(clientid, orden);

                if (resultado) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ mensaje: "Orden creada exitosamente" }));

                }



            } catch (error) {
                let mensaje = "Error interno del servidor";
                let codigoHttp: number;
                let errorCause: string;

                if (error instanceof CustomError) {

                    mensaje = error.message;
                    codigoHttp = error.statusCode || 500;
                    errorCause = error.error || "";
                } else {
                    errorCause = "Error desconocido";
                    codigoHttp = 500;
                }
                res.writeHead(codigoHttp, { "Content-Type": "application/json" });
                res.end(JSON.stringify(new ErrorDto(errorCause, mensaje)));
            }

        });












    }
}