

import { RouteLinkType } from "./RouteType";

/**
 * Clase que mantiene un registro de las rutas y sus controladores, métodos http y manejadores en la aplicación.
 */
export class RouteRegistry {
    private static routes: RouteLinkType[] = [];
    /**
     * 
     * @param method 
     * @param path 
     * @param handler 
     * @param controller 
     * 
     * metodo que agrega una ruta al registro de rutas.
     */
  
    static addRoute(method: string, path: string, handler: Function, controller: any) {
      this.routes.push({ method, path, handler, controller});
    }
  
    static getRoutes() {
      return this.routes;
    }
  }
  