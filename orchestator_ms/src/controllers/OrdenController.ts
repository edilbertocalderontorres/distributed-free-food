

import { Post } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { manejarOrden } from '../services/OrdenService';
import { Beneficiario, Orden, EstadoOrden } from '../models/models';
import { CustomError } from "../exception/CustomError";
export class OrdenController {

    constructor() { }

    @Post("/orden")
    public async manejarOrden(req: IncomingMessage, res: ServerResponse): Promise<void> {
        let body = "";

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
                    beneficiarioId: container.beneficiario.tipoDocumento.concat(container.beneficiario.numDocumento),
                    recetaId: null,
                    estado: "PENDIENTE" as EstadoOrden,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date()
                };
                const resultado = await manejarOrden(orden);

                if (resultado) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ mensaje: "Orden creada exitosamente" }));

                }



            } catch (error) {
                let mensaje = "Error interno del servidor";
                let codigoHttp: number;

                if (error instanceof CustomError) {

                    mensaje = error.message;
                    codigoHttp = error.statusCode || 500;
                } else {

                    mensaje = "Error interno del servidor";
                    codigoHttp = 500;
                }
                res.writeHead(codigoHttp, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ mensaje: mensaje }));







            }

        });












    }
}