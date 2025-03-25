import { IncomingMessage, ServerResponse } from "http";
import { Get } from "../utils/httputils/routing/RouteDecorators";
import { manejarError } from "./error/ErrorHandler";
import { obtenerHistorialCompras } from "../services/CrudService";
import { json } from 'stream/consumers';
import { Wrapper } from "./dto/CrudDto";

export class CompraController {
    @Get("/compras/historial")
    public async obtenerHistorialCompras(req: IncomingMessage, res: ServerResponse): Promise<void> {

        
        let body = "";
        let jsonBody: Wrapper;
        req.on("data", (chunk) => {
            body += chunk.toString();

        });

        req.on("end", async () => {

            jsonBody = await JSON.parse(body);

            try {
                const compras = await obtenerHistorialCompras(jsonBody.paginacion);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(compras));
            } catch (error) {
                manejarError(res, error);
            }
        });
    }
}