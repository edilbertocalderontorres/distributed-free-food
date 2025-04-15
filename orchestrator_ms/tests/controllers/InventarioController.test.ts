import { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { CompraController } from "../../src/controllers/CompraController";
import { Wrapper } from "../../src/controllers/dto/CrudDto";
import { manejarError } from "../../src/controllers/error/ErrorHandler";
import { Inventario, ListaCompras } from '../../src/models/models';
import { obtenerInventario } from "../../src/services/CrudService";
import { InventarioController } from "../../src/controllers/InventarioController";

jest.mock("@src/services/CrudService");
jest.mock("@src/controllers/error/ErrorHandler");

describe("InventarioController.obtenerInventario", () => {
    it("debería responder inventario de productos", async () => {

        const fakeReqBody: Wrapper = { data: null, paginacion: { page: 1, limit: 10 } };
        const fakeInventario: Inventario = {
            inventario: [
                { nombre: "Carne", cantidaddisponible: 5 }

            ]

        };

        (obtenerInventario as jest.Mock).mockResolvedValue(fakeInventario);
        const req = new Readable({
            read() { }
        }) as IncomingMessage;
        req.headers = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        } as unknown as ServerResponse;
        const controller = new InventarioController();

        const body = JSON.stringify(fakeReqBody);
        process.nextTick(() => {
            req.emit("data", Buffer.from(body));
            req.emit("end");
        }   );
        controller.obtenerInventario(req, res); 

    })

    it("debería manejar errores con manejarError", async () => {
        const fakeReqBody = { paginacion: { page: 1, limit: 10 } };
        (obtenerInventario as jest.Mock).mockRejectedValue(new Error("Error"));

        const req = new Readable({
            read() { }
        }) as IncomingMessage;
        req.headers = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        } as unknown as ServerResponse;
        const controller = new InventarioController();

        const body = JSON.stringify(fakeReqBody);
        process.nextTick(() => {
            req.emit("data", Buffer.from(body));
            req.emit("end");
        });

        controller.obtenerInventario(req, res);

        

        expect(manejarError).toHaveBeenCalledWith(res, expect.any(Error));
    });

});

