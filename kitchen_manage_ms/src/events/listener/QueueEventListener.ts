
import { connectRabbitMQ } from "../../config/RabbitConfig";


export const escucharEvento = async (cola:string) => {
  const channelModel = await connectRabbitMQ();

  const channel = await channelModel.createChannel();
  
  await channel.assertQueue(cola, { durable: true });

  console.log(`Esperando mensajes en ${cola}...`);

  channel.consume(
    cola,
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
