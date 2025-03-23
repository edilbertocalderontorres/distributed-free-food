
import { json } from "stream/consumers";
import { connectRabbitMQ } from "../../config/RabbitConfig";
import { CustomError } from "../../exception/CustomError";


export const publicarEvento = async (message: any, exchange: string, routingKey: string): Promise<boolean> => {
  const channelModel = await connectRabbitMQ();

  const channel = await channelModel.createChannel();


  let estadoEnvio: boolean = false;

  try {

    estadoEnvio = channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

  } catch (error) {
    console.log(`Error al enviar mensaje: ${error}`);
    throw new CustomError("Error al enviar mensaje", 500, "Servicio RabbitMQ no disponible");
  }

  console.log(`Mensaje enviado: ${JSON.stringify(message)}`);

  setTimeout(() => {
    channel.close();
  }, 500);

  return new Promise((resolve, reject) => {
    resolve(estadoEnvio);
  });
};
