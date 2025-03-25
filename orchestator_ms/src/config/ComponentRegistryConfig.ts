import { CompraController } from '../controllers/CompraController';
import { InventarioController } from '../controllers/InventarioController';
import { OrdenController } from '../controllers/OrdenController';
import { RecetaController } from '../controllers/RecetaController';
import { EstadoOrdenListenerActivador } from '../events/component/EstadoOrdenListenerActivador';
/*
* Simula la configuración de un contenedor de inversión de control en inyeccion de dependencias de algunos frameworks backend

* como cuando Spring Boot crea un contenedor de beans y los disponibiliza en el contexto de la app 
*/
export const components = {
    FoodOrderController: new OrdenController(),
    CompraController: new CompraController(),
    InventarioController: new InventarioController(),
    OrdenController: new OrdenController(),
   RecetaController: new RecetaController(),
 
};