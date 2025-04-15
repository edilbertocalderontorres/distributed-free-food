import { IncomingMessage, ServerResponse } from "http";
import { Get, Post } from "../utils/httputils/routing/RouteDecorators";
import { manejarError } from "./error/ErrorHandler";
import { obtenerHistorialCompras } from "../services/CrudService";
import { json } from 'stream/consumers';
import { Wrapper } from "./dto/CrudDto";
import { ListaCompras } from "../models/models";

export class CompraController {
    @Post("/compras/historial")
    public  obtenerHistorialCompras(req: IncomingMessage, res: ServerResponse):void {


        let body = "";
        let jsonBody: Wrapper;
        req.on("data", (chunk) => {
            body += chunk.toString();

        });

        req.on("end", async () => {

            jsonBody = await JSON.parse(body);

            try {
                const compras:ListaCompras = await obtenerHistorialCompras(jsonBody.paginacion);



                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(compras));
            } catch (error) {
                manejarError(res, error);
            }
        });
    }
}

