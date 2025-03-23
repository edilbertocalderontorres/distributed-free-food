
import { publicarEvento} from "../events/pub/RabbitEventPub";
import dotenv from 'dotenv';
import { Orden } from "../models/models";
dotenv.config();

export async function notificarOrdenFinalizada(orden: Orden):Promise<boolean> {

    const exchange = process.env.ESTADO_ORDEN_EX || '';
    const routingKey = process.env.ESTADO_ORDEN_RK || '';

    const message = {
        orden: orden
    };

    return publicarEvento(message, exchange, routingKey);
}