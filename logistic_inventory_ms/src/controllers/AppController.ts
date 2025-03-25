

import { Get } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { suscribirEventoNuevaCompra } from "../services/ProcesarSolicitudCOmpra";

export class AppController {



    constructor() {
        suscribirEventoNuevaCompra().then();

    }

    @Get("/health")
    public async manejarOrden(req: IncomingMessage, res: ServerResponse, pathParams: any, queryParams: any): Promise<void> {


    }















}