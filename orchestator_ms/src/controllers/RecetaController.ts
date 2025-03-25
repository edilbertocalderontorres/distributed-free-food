import { IncomingMessage, ServerResponse } from "http";
import { Get } from "../utils/httputils/routing/RouteDecorators";
import { manejarError } from "./error/ErrorHandler";
import { Wrapper } from "./dto/CrudDto";
import { obtenerRecetas } from "../services/CrudService";


export class RecetaController {
    @Get("/recetas")
    public async obtenerRecetas(req: IncomingMessage, res: ServerResponse): Promise<void> {

        let body = "";
        let jsonBody: Wrapper;
        req.on("data", (chunk) => {
            body += chunk.toString();

        });

        req.on("end", async () => {
            try {
                const recetas = await obtenerRecetas();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(recetas));
            } catch (error) {
                manejarError(res, error);
            }
        });
    }
}