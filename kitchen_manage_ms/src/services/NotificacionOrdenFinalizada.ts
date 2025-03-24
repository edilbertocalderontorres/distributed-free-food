
import { publicarEvento } from "../events/pub/RabbitEventPub";
import dotenv from 'dotenv';
import { EventoEstado, Orden } from "../models/models";
dotenv.config();

export async function notificarEstadoOrden(clientId: string, orden: Orden, porcentaje:number): Promise<boolean> {

    const exchange = process.env.EXCHANGE_ESTADO_ORDEN || '';
    const routingKey = process.env.ROUTING_KEY_ESTADO_ORDEN || '';

    const message = {
        clientId: clientId,
        orden: orden,
        porcentaje: porcentaje
    } as EventoEstado;

    return publicarEvento(message, exchange, routingKey);
}