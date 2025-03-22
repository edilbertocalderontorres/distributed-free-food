import amqp from "amqplib";
import { connectRabbitMQ } from "../../config/RabbitConfig";
import dotenv from "dotenv";

dotenv.config();

const EXCHANGE = process.env.EXCHANGE_NUEVA_ORDEN || "";

export const publishMessage = async(message: string) => {
  const channelModel = await connectRabbitMQ();
 
  const channel = await channelModel.createChannel();
  

  await channel.assertExchange(EXCHANGE, "fanout", { durable: true });

  channel.publish(EXCHANGE, "ROUTINGkEY",Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Mensaje enviado: ${JSON.stringify(message)}`);

  setTimeout(() => {
    channel.close();
  }, 500);
};
