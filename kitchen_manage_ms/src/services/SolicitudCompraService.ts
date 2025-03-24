import { Ingrediente, SolicitudCompra } from "../models/models";
import { publicarEvento } from "../events/pub/RabbitEventPub";
import dotenv from 'dotenv';

dotenv.config();

export async function generarSolicitudCompra(solicitud: SolicitudCompra):Promise<boolean> {

    const exchange = process.env.EXCHANGE_SOLICITUD_COMPRA || '';
    const routingKey = process.env.ROUTING_KEY_SOLICITUD_COMPRA || '';

    

    return publicarEvento(solicitud, exchange, routingKey);
}
