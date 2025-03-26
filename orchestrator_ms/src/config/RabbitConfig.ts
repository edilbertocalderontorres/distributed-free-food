import amqp, { ChannelModel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL:string|any = process.env.RABBITMQ_URL;

export const connectRabbitMQ = async (): Promise<ChannelModel> => {
  try {
    const channelModel = await amqp.connect(RABBITMQ_URL);
    
  
    return await channelModel;
    } catch (error) {
    console.error(" Error al conectar con RabbitMQ", error);
    process.exit(1); 
  }
};
