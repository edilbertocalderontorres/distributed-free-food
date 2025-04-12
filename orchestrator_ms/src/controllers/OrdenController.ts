

import { Post, Get } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { manejarOrden } from '../services/OrdenService';
import { Beneficiario, Orden, EstadoOrden } from '../models/models';
import { manejarError } from './error/ErrorHandler';
import { obtenerEstadoOrdenes, obtenerHistorialPedidos } from "../services/CrudService";
import { Wrapper } from "./dto/CrudDto";

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
                    recetanombre: null,
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
                manejarError(res, error);

            }

        });

    }


    @Get("/ordenes")
    public async obtenerEstadoOrdenes(req: IncomingMessage, res: ServerResponse): Promise<void> {

        let body = "";
        let jsonBody: Wrapper;
        req.on("data", (chunk) => {
            body += chunk.toString();

        });

        req.on("end", async () => {
            try {
                const ordenes = await obtenerEstadoOrdenes();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(ordenes));
            } catch (error) {
                manejarError(res, error);
            }
        });
    }

    @Post("/ordenes/historial")
    public async obtenerHistorialPedidos(req: IncomingMessage, res: ServerResponse, pathParams: any, queryParams: any): Promise<void> {

        let body = "";
        let jsonBody: Wrapper;
        req.on("data", (chunk) => {
            body += chunk.toString();

        });

        req.on("end", async () => {
            jsonBody = await JSON.parse(body);
        try {
            const historial = await obtenerHistorialPedidos(jsonBody.paginacion);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(historial));
        } catch (error) {
            manejarError(res, error);
        }
    });
    }


}