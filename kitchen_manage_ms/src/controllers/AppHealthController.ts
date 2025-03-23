

import { Get } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { prepararNuevoPlato } from '../services/ManejoOrden';
import { Beneficiario, Orden, EstadoOrden } from '../models/models';
export class AppHealthController {

    constructor() { }

    @Get("/health")
    public health(req: IncomingMessage, res: ServerResponse): void {

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: 'UP', message: 'Servicio activo y conectado a RabbitMQ' }));

    }













}