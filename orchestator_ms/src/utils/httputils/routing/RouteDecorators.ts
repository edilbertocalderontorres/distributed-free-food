
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
export function Get(path: string): MethodDecorator {
  return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
    
    RouteRegistry.addRoute("GET", path, descriptor.value as Function, target.constructor);
  };
}

export function Post(path: string): MethodDecorator {
  return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
    RouteRegistry.addRoute("POST", path, descriptor.value as Function, target.constructor);
  };

  
}

export function Put(path: string): MethodDecorator {
    return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
      RouteRegistry.addRoute("PUT", path, descriptor.value as Function, target.constructor);
    };
  }

  export function Delete(path: string): MethodDecorator {
    return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
      RouteRegistry.addRoute("DELETE", path, descriptor.value as Function, target.constructor);
    };
  }

  export function Patch(path: string): MethodDecorator {
    return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
      RouteRegistry.addRoute("PATCH", path, descriptor.value as Function, target.constructor);
    };
  }

  export function Options(path: string): MethodDecorator {
    return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
      RouteRegistry.addRoute("OPTIONS", path, descriptor.value as Function, target.constructor);
    };
  }

  export function Head(path: string): MethodDecorator {
    return (target:Object, propertyKey:string|symbol,  descriptor:TypedPropertyDescriptor<any>) => {
      RouteRegistry.addRoute("HEAD", path, descriptor.value as Function, target.constructor);
    };
  }


