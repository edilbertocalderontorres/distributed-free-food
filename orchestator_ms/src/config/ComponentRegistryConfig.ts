import { OrdenController } from '../controllers/OrdenController';
import { EstadoOrdenListenerActivador } from '../events/component/EstadoOrdenListenerActivador';
/*
* Simula la configuración de un contenedor de inversión de control en inyeccion de dependencias de algunos frameworks backend

* como cuando Spring Boot crea un contenedor de beans y los disponibiliza en el contexto de la app 
*/
export const components = {
    FoodOrderController: new OrdenController(),
 
};