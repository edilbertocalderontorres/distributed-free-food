
import { iniciar } from './CompraService';
import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';
import { SolicitudCompra } from '../models/models';
import dotenv from 'dotenv';


dotenv.config();




export async function suscribirEventoNuevaCompra(): Promise<boolean> {

  const queue = process.env.QUEUE_SOLICITUD_COMPRA || '';

  const channel = await obtenerRabbitChannel(queue);




  channel.consume(
    queue,
    (msg) => {
      if (msg) {

        const evt: SolicitudCompra = JSON.parse(msg.content.toString());
        gestionar(evt.clientid, evt).then();
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

export async function gestionar(clientId: string, SolicitudCompra: SolicitudCompra): Promise<void> {

 iniciar(SolicitudCompra);

}
