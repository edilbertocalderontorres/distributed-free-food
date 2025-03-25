

import { Get } from "../utils/httputils/routing/RouteDecorators";
import { IncomingMessage, ServerResponse } from "http";
import { manejarError } from "./error/ErrorHandler";
import { Wrapper } from './dto/CrudDto';
import { obtenerInventario } from "../services/CrudService";

export class InventarioController {

    constructor() {

    }

    
        @Get("/bodega/inventario")
        public async obtenerInventario(req: IncomingMessage, res: ServerResponse): Promise<void> {
            let body = "";
                    let jsonBody: Wrapper;
                    req.on("data", (chunk) => {
                        body += chunk.toString();
            
                    });
            
                    req.on("end", async () => {

            try {
                const inventario = await obtenerInventario();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(inventario));
            } catch (error) {
                manejarError(res, error);
            }
        });
        }
    
    
}