import { createServer, IncomingMessage, ServerResponse } from "http";
import { RouteRegistry } from "./utils/httputils/routing/RouteRegistry";
import { controllers } from './config/ControllerRegistryConfig';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  
  
  const routeLink = RouteRegistry.getRoutes().find(
    (r) => r.method === req.method && r.path === req.url
  );
 
  if (routeLink) {
    //obtiene la instancia  del controlador asociado de la routeLink
    const controller = controllers[routeLink.controller.name as keyof typeof controllers];

    //delega el manejo de la solicitud al controlador y su método asociado.
    routeLink.handler.call(controller, req, res);
    
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }

  
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


