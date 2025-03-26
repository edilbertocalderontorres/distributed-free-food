import { createServer, IncomingMessage, ServerResponse } from "http";
import { RouteRegistry } from "./utils/httputils/routing/RouteRegistry";
import { components } from './config/ComponentRegistryConfig';
import { suscribirActualizacionEstado } from "./services/ManejaEventoEstadoOrdenService";

import { WebSocketManager } from "./events/ws/WebSocketManager";
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-ClientId");

  if (req.method === "OPTIONS") {
    res.writeHead(200); 
    res.end();
    return;
  }
  const routeLink = RouteRegistry.getRoutes().find(
    (r) => r.method === req.method && r.path === req.url
  );

  if (routeLink) {
    //obtiene la instancia  del controlador asociado de la routeLink
    const controller = components[routeLink.controller.name as keyof typeof components];

    //delega el manejo de la solicitud al controlador y su método asociado.
    routeLink.handler.call(controller, req, res);

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }


});

const PORT = 8080;

const wsManager = WebSocketManager.getInstance(server);
suscribirActualizacionEstado().then();
server.listen(PORT, () => {

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




