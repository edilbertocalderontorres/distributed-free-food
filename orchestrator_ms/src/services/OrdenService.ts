import { Orden } from "../models/models";
import { OrdenRepository } from "../repositories/OrdenRepository";
import { publicarEvento } from "../events/pub/RabbitEventPub";
import dotenv from 'dotenv';
import { CustomError } from "../exception/CustomError";
dotenv.config();
export async function manejarOrden(clientId: string, orden: Orden): Promise<boolean> {
    const exchange = process.env.EXCHANGE_NUEVA_ORDEN || '';
    const routingKey = process.env.ROUTING_KEY_NUEVA_ORDEN || '';
    const repository = new OrdenRepository();


    const ordenExistente = await repository.getByBeneficiarioId(orden.beneficiarioid);

    if (ordenExistente?.estado === "PENDIENTE" || ordenExistente?.estado === "EN PREPARACION") {
        throw new CustomError("Ya existe una orden en curso para este beneficiario", 409, "No se puede crear la orden");
    } else {
       
        const res = await repository.create(orden);

        const evt = { clientid: clientId, orden: res };

        return await publicarEvento(evt, exchange, routingKey);
    }




}






