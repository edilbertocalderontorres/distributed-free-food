
import { publicarEvento } from "../events/pub/RabbitEventPub";
import dotenv from 'dotenv';
import { RespuestaCompra } from "../models/models";
dotenv.config();

export async function notificarRespuestaCompra( respuestaCompra: RespuestaCompra): Promise<boolean> {

    const exchange = process.env.EXCHANGE_RESPUESTA_COMPRA || '';
    const routingKey = process.env.ROUTING_KEY_RESPUESTA_COMPRA || '';

    const message = {
        clientid: respuestaCompra.clientid,
        ordenid: respuestaCompra.ordenid,
        compra: respuestaCompra.compra
    } as RespuestaCompra;

    return publicarEvento(message, exchange, routingKey);
}