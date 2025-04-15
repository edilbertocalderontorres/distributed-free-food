import http from 'http';
import url from 'url';
import { RouteRegistry } from "../utils/httputils/routing/RouteRegistry";
import { components } from '../config/ComponentRegistryConfig';

// Definición de tipos
interface RequestData {
  count: number;
  timestamp: number;
}

interface RateLimitConfig {
  WINDOW_MS: number;
  MAX_REQUESTS: number;
}

interface ClientRequest extends http.IncomingMessage {
  parsedUrl?: url.UrlWithParsedQuery;
}

// Configuración del rate limiting
const RATE_LIMIT: RateLimitConfig = {
  WINDOW_MS: 60 * 1000, // 1 minuto
  MAX_REQUESTS: 100, // Máximo 100 peticiones por minuto
};

// Objeto para almacenar los contadores de peticiones por IP
const requestCounts: Record<string, RequestData> = {};

// Función para limpiar contadores antiguos
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of Object.entries(requestCounts)) {
    if (now - data.timestamp > RATE_LIMIT.WINDOW_MS) {
      delete requestCounts[ip];
    }
  }
}, RATE_LIMIT.WINDOW_MS);

// Función para obtener la IP del cliente
function getClientIp(req: http.IncomingMessage): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  return (typeof xForwardedFor === 'string' 
    ? xForwardedFor.split(',')[0].trim() 
    : req.socket.remoteAddress) || 'unknown';
}


export function securityFilterGateway(req: ClientRequest, res: http.ServerResponse):void  {
  const clientIp = getClientIp(req);
  const currentTime = Date.now();

  // Inicializar contador para la IP si no existe
  if (!requestCounts[clientIp]) {
    requestCounts[clientIp] = {
      count: 0,
      timestamp: currentTime
    };
  }

  // Resetear contador si la ventana de tiempo ha expirado
  if (currentTime - requestCounts[clientIp].timestamp > RATE_LIMIT.WINDOW_MS) {
    requestCounts[clientIp] = {
      count: 0,
      timestamp: currentTime
    };
  }

  // Incrementar contador
  requestCounts[clientIp].count += 1;

  // Verificar si se ha excedido el límite
  if (requestCounts[clientIp].count > RATE_LIMIT.MAX_REQUESTS) {
    res.writeHead(429, {
      'Content-Type': 'application/json',
      'Retry-After': Math.floor(RATE_LIMIT.WINDOW_MS / 1000).toString()
    });
    res.end(JSON.stringify({
      error: 'Demasiadas solicitudes',
      mensaje: `Has excedido el límite de ${RATE_LIMIT.MAX_REQUESTS} solicitudes en ${RATE_LIMIT.WINDOW_MS/1000} segundos. `
    }));
    return;
  }

  // Parsear la URL
  req.parsedUrl = url.parse(req.url || '', true);

  
  // Manejar la petición normalmente si no se ha excedido el límite
 // Configuración de CORS
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-ClientId");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  const routeLink = RouteRegistry.getRoutes().find(
    (route) => route.method === req.method && route.path === req.url
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

}

// Iniciar el servidor
