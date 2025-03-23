
import dotenv from 'dotenv';
import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';

dotenv.config();
export function suscribirActualizacionEstado(): Promise<void> {

    const queue = process.env.QUEUE_ACTUALIZACION_ESTADO||'';
   
    return obtenerRabbitChannel(queue)
    .then(channel=>{

        channel.consume(
            queue,
            (msg) => {
              if (msg) {

                const content = msg.content.toString();
                console.log(` Mensaje recibido: ${content}`);
                channel.ack(msg); 
              }
            },
            { noAck: false }
          );
    }

    

    ).catch((error) => {
        console.log(`Error al escuchar el evento: ${error}`);
    });

}