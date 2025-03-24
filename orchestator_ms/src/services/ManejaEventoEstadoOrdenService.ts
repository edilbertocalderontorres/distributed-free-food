
import dotenv from 'dotenv';
import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';
import { WebSocketManager } from '../events/ws/WebSocketManager';
import { EventoEstado, Orden } from '../models/models';


dotenv.config();
export async function suscribirActualizacionEstado(): Promise<boolean> {

  const queue = process.env.QUEUE_ESTADO_ORDEN || '';
  const wsManager = WebSocketManager.getInstance();

  const channel = await obtenerRabbitChannel(queue);

  channel.consume(
    queue,
    (msg) => {
      if (msg) {

        const content: EventoEstado = JSON.parse(msg.content.toString());
        wsManager.sendMessages(JSON.stringify(content), content.clientId);
    
        channel.ack(msg);
      }
    },
    { noAck: false }
  ).then();




  if (channel.connection) {
    return true;
  }
  return false;


}
