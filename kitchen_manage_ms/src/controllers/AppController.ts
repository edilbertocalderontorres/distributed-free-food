

import { Get } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { suscribirEventoNuevaOrden  } from "../services/PreparacionOrdenService";
import { reanudarOrdenPorCompra } from "../services/ReanudacionOrdenPorCompra";

export class AppController{

    estadoColaNuevaOrden: boolean = false
    estadoColaCompraRealizada: boolean = false

    constructor() { 
        this.initialize();
    }

    private async initialize() {
        this.estadoColaNuevaOrden = await suscribirEventoNuevaOrden();

        this. estadoColaCompraRealizada=await reanudarOrdenPorCompra();

    }

    @Get("/health")
    public async manejarOrden(req: IncomingMessage, res: ServerResponse): Promise<void> {

        if(this.estadoColaCompraRealizada && this.estadoColaNuevaOrden){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "UP" }));

        }
        else{
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "DOWN" }));
        }
        }

       













}