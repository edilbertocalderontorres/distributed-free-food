
import http from 'http';
import url from 'url';
import { createClient, RedisClientType } from 'redis';
import { RouteRegistry } from "../utils/httputils/routing/RouteRegistry";
import { components } from '../config/ComponentRegistryConfig';
import dotenv from 'dotenv';
import { Channel } from 'amqplib';
dotenv.config();

// Definición de tipos
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

// Crear cliente Redis
const redisClient: RedisClientType = createClient({
    
    url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`,
    socket: {
        tls: false,
        reconnectStrategy: (retries) => Math.min(retries * 100, 5000)
      }

});

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

// Conectar a Redis
async function connectRedis(): Promise<void> {
  await redisClient.connect();
  console.log('Connected to Redis');
}

if(process.env.CACHE_ACTIVE as unknown as boolean === true){
connectRedis().catch(console.error);
}

// Función para obtener la IP del cliente
function getClientIp(req: http.IncomingMessage): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  return (typeof xForwardedFor === 'string' 
    ? xForwardedFor.split(',')[0].trim() 
    : req.socket.remoteAddress) || 'unknown';
}

// Middleware de rate limiting con Redis
async function rateLimitMiddleware(req: http.IncomingMessage, res: http.ServerResponse): Promise<boolean> {
  const clientIp = getClientIp(req);
  const key = `rate_limit:${clientIp}`;

  try {
    const [count, ttl] = await redisClient.multi()
      .incr(key)
      .ttl(key)
      .exec() as [number, number];

    // Si es la primera petición en la ventana actual, establecer TTL
    if (count === 1) {
      await redisClient.expire(key, Math.floor(RATE_LIMIT.WINDOW_MS / 1000));
    }

    // Verificar si se ha excedido el límite
    if (count > RATE_LIMIT.MAX_REQUESTS) {
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': ttl > 0 ? ttl.toString() : Math.floor(RATE_LIMIT.WINDOW_MS / 1000).toString()
      });
      res.end(JSON.stringify({
        error: 'Demasiadas Solicitudes',
        message: `Limite excedido, intente nuevamente en ${ttl > 0 ? ttl : Math.floor(RATE_LIMIT.WINDOW_MS / 1000)} segundos.`
      }));
      return false;
    }

    // Añadir headers con información del rate limit
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT.MAX_REQUESTS - count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + (ttl > 0 ? ttl * 1000 : RATE_LIMIT.WINDOW_MS)).toISOString());

    return true;
  } catch (err) {
    console.error('Rate limit error:', err);
    // En caso de error con Redis, permitir la petición
    return true;
  }
}

// Crear el servidor HTTP
export async function cachedSecurityFilterGateway ( req: ClientRequest, res: http.ServerResponse) : Promise<void>  {
  // Aplicar rate limiting
  const allowed = await rateLimitMiddleware(req, res);
  if (!allowed) return;

  // Parsear la URL
  req.parsedUrl = url.parse(req.url || '', true);
  
  // Manejar la petición normalmente
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
  
  
  
};

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing server and Redis connection...');
    await redisClient.quit();
    
  });