import amqp from "amqplib";
import { connectRabbitMQ } from "../../config/RabbitConfig";




export const publishMessage = async(message: string, exchange:string, routingKey:string) => {
  const channelModel = await connectRabbitMQ();
 
  const channel = await channelModel.createChannel();
  

  await channel.assertExchange(exchange, "direct", { durable: true });

  channel.publish(exchange, routingKey,Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Mensaje enviado: ${JSON.stringify(message)}`);

  setTimeout(() => {
    channel.close();
  }, 500);
};
