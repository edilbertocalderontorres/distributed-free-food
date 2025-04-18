import { IncomingMessage, ServerResponse } from "http";
import { OrdenController } from "../../src/controllers/OrdenController";


import { Readable } from "stream";


import { manejarOrden } from "../../src/services/OrdenService";
import { Beneficiario, Orden } from "../../src/models/models";
import { EstadoOrden } from "../../src/models/models";




jest.mock("../../src/controllers/error/ErrorHandler");

jest.mock("../../src/services/OrdenService");


describe("OrdenController.manejarOrden", () => {


    it("debería manejar una orden correctamente", (done) => {
        const fakeReqBody: Beneficiario = { 
            beneficiario: {
                tipodocumento: "CC",
                numdocumento: "123456789"
            }
        };
    
        const fakeOrden = {
            id: "",
            recetanombre: null,
            beneficiarioid: "CC123456789",
            recetaid: null,
            estado: "PENDIENTE",
            fechacreacion: new Date(),
            fechaactualizacion: new Date()
        };
    
        (manejarOrden as jest.Mock).mockResolvedValue(fakeOrden);
    
        const req = new Readable({
            read() {}
        }) as IncomingMessage;
    
        req.headers = { "x-clientid": "test-client-id" };
    
        const res = {
            writeHead: jest.fn(),
            end: jest.fn(() => {
                try {
                    expect(manejarOrden).toHaveBeenCalledWith("test-client-id", expect.objectContaining({
                        beneficiarioid: "CC123456789"
                    }));
                    expect(res.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json" });
                    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ mensaje: "Orden creada exitosamente" }));
                    done(); 
                } catch (error) {
                    done(error); 
                }
            })
        } as unknown as ServerResponse;
    
        const controller = new OrdenController();
    
        const body = JSON.stringify(fakeReqBody);
        process.nextTick(() => {
            req.emit("data", Buffer.from(body));
            req.emit("end");
        });
    
        controller.manejarOrden(req, res);
    });


   
    

});