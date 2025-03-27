
import { RouteRegistry } from "./RouteRegistry";

/** 
 * Dado que el ejercicio debe ser realizado con Node Puro sin usar framework, se usa la versatilidad de Typescript para 
 * 
 * proporcionar Decoradores de métodos para definir rutas http en controladores,
 * lo que disminuye la complejidad cognitiva del routing en node puro, añadiendo dinamismo al automatizar la creación de rutas.
 * Esto es una contribución mía producto de la investigación y el aprendizaje de TypeScript/NodeJS, 
 * aunque algunos frameworks como NestJS ya lo implementan.
 */



/**
 * Decorador de método para definir una ruta GET en un controlador.
 *  @param path - el path URL para la ruta.
 * 
 * descriptor.value es la función que se ejecutará cuando se haga una solicitud a la ruta.
 * 
 * target.constructor es el controlador asociado con la ruta.
 * 
 * 
 * */
export function createMethodDecorator(method: string) {
  return (path: string): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      
      const originalMethod = descriptor.value;
      
      RouteRegistry.addRoute(method, path, async (req: any, res: any) => {
        const pathParams = extractPathParams(path, req.url);
        const queryParams = req.query;
        
        
        await originalMethod.apply(target, [req, res, pathParams, queryParams]);
      }, target.constructor);
    };
  };
}

export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Delete = createMethodDecorator("DELETE");
export const Patch = createMethodDecorator("PATCH");
export const Options = createMethodDecorator("OPTIONS");
export const Head = createMethodDecorator("HEAD");


function extractPathParams(routePath: string, requestUrl: string): Record<string, string> {
  const routeParts = routePath.split("/");
  const urlParts = requestUrl.split("/");
  const params: Record<string, string> = {};

  routeParts.forEach((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      params[paramName] = urlParts[index];
    }
  });

  return params;
}



