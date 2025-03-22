
import { connectRabbitMQ } from "../../config/RabbitConfig";
import dotenv from "dotenv";

dotenv.config();

const QUEUE= process.env.QUEUE_ESTADO_ORDEN||"";

export const escucharCambiosDeEstado = async () => {
  const channelModel = await connectRabbitMQ();

  const channel = await channelModel.createChannel();
  
  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`Esperando mensajes en ${QUEUE}...`);

  channel.consume(
    QUEUE,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log(` Mensaje recibido: ${content}`);
        channel.ack(msg); 
      }
    },
    { noAck: false }
  );
};
