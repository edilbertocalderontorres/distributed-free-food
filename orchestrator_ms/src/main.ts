import { createServer, IncomingMessage, ServerResponse } from "http";

import { suscribirActualizacionEstado } from "./services/ManejaEventoEstadoOrdenService";
import { securityFilterGateway } from './security/ApiGatewayConfig';
import { WebSocketManager } from "./events/ws/WebSocketManager";
import dotenv from 'dotenv';
import { cachedSecurityFilterGateway } from "./security/ApiGatewayConfigCahed";
dotenv.config();
const server =  createServer(async (req: IncomingMessage, res: ServerResponse) => {

  //api gateway
  const cacheIsActive:boolean = process.env.CACHE_ACTIVE as unknown as boolean ;
  if (cacheIsActive) {

    await cachedSecurityFilterGateway(req, res);
    return;
  }
  securityFilterGateway(req, res);
  
  return;

});

const PORT = 8080;

const wsManager = WebSocketManager.getInstance(server);
suscribirActualizacionEstado().then();
server.listen(PORT, () => {

  console.log(`ESCUCHANDO EN EL PUERTO: ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server and Redis connection...');
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});




