import { IncomingMessage, ServerResponse } from "http";
import { CompraController } from "../../src/controllers/CompraController";
import { obtenerHistorialCompras } from "../../src/services/CrudService";
import { manejarError } from "../../src/controllers/error/ErrorHandler";

import { Readable } from "stream";
import { Wrapper } from "../../src/controllers/dto/CrudDto";
import { ListaCompras } from "../../src/models/models";

jest.mock("@src/services/CrudService");
jest.mock("@src/controllers/error/ErrorHandler");

describe("CompraController.obtenerHistorialCompras", () => {
    it("debería responder con lista de compras", async () => {
        
        const fakeReqBody: Wrapper = { data: null, paginacion: { page: 1, limit: 10 } };
        const fakeCompras: ListaCompras = {
            compras: [
                { nombre: "Ingrediente1", ingredienteid: "1", cantidadcomprada: 10, fechacompra: "2023-01-01", id: "1" }
            ]
        };

        (obtenerHistorialCompras as jest.Mock).mockResolvedValue(fakeCompras);

        const req = new Readable({
            read() {} 
          }) as IncomingMessage;
        req.headers = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        } as unknown as ServerResponse;

        const controller = new CompraController();

        
        const body = JSON.stringify(fakeReqBody);


        process.nextTick(() => {
            req.emit("data", Buffer.from(body));
            req.emit("end");
        });

        controller.obtenerHistorialCompras(req, res);

        
       

        expect(obtenerHistorialCompras).toHaveBeenCalledWith(fakeReqBody.paginacion);
        expect(res.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json" });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify(fakeCompras));
    });

    it("debería manejar errores con manejarError", async () => {
        const fakeReqBody = { paginacion: { pagina: 1, size: 10 } };
        (obtenerHistorialCompras as jest.Mock).mockRejectedValue(new Error("Error"));

        const req = new Readable({
            read() {} 
          }) as IncomingMessage;
          
        req.headers = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        } as unknown as ServerResponse;

        const controller = new CompraController();

        const body = JSON.stringify(fakeReqBody);
        process.nextTick(() => {
            req.emit("data", Buffer.from(body));
            req.emit("end");
        });

        controller.obtenerHistorialCompras(req, res);

        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(manejarError).toHaveBeenCalled();
    });
});




