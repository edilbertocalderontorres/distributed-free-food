
import { Channel } from "amqplib";
import { connectRabbitMQ } from "../../config/RabbitConfig";


export const obtenerRabbitChannel = async (queue:string):Promise<Channel> => {
  const channelModel = await connectRabbitMQ();

  const channel = await channelModel.createChannel();
  
  await channel.assertQueue(queue, { durable: true });

  console.log(`Esperando mensajes en ${queue}...`);

   return channel;
};
