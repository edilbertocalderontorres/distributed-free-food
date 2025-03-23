

import { Post } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { registrar } from '../services/OrdenService';
import { Beneficiario, Orden, EstadoOrden } from '../models/models';
export class OrdenController {

    constructor() { }

    @Post("/orden")
    public manejarOrden(req: IncomingMessage, res: ServerResponse): void {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();

        });
        let container: Beneficiario;
        let orden: Orden;


        req.on("end", () => {
            try {
                container = JSON.parse(body);

                console.log(container)
                orden = {
                    id: "",
                    beneficiarioId: container.beneficiario.tipoDocumento.concat(container.beneficiario.numDocumento),
                    platoId: null,
                    estado: "PENDIENTE" as EstadoOrden,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date()
                };
                registrar(orden)
                    .then((orden) => {

                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(orden));
                    }).catch((error) => {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(error));
                    });

            } catch (error) {
                console.log(error)

            }

        });












    }
}