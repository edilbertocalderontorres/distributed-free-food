

import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';
import { RecetaRepository } from '../repositories/RecetaRepository';
import { Receta, Orden, Ingrediente, EstadoOrden, SolicitudCompra, EventoNuevaOrden, RecetaIngrediente, ItemBodega, UUID, Compra } from '../models/models';
import { IngredienteRepository } from '../repositories/IngredienteRepository';
import { BodegaRepository } from '../repositories/BodegaRepository';
import { generarSolicitudCompra } from './SolicitudCompraService';
import { OrdenRepository } from '../repositories/OrdenRepository';
import dotenv from 'dotenv';
import { notificarEstadoOrden } from './NotificacionOrdenFinalizada';


dotenv.config();
const ingredienteRepository = new IngredienteRepository();
const bodegaRepository = new BodegaRepository();
const ordenRepository = new OrdenRepository();
const recetaRepository = new RecetaRepository();



export async function suscribirEventoNuevaOrden(): Promise<boolean> {

  const queue = process.env.QUEUE_NUEVA_ORDEN || '';

  const channel = await obtenerRabbitChannel(queue);




  channel.consume(
    queue,
    (msg) => {
      if (msg) {

        const evt: EventoNuevaOrden = JSON.parse(msg.content.toString());
        gestionar(evt.clientid, evt.orden).then();
        channel.ack(msg);
      }
    },
    { noAck: false }
  ).then();

  if (channel.connection) {
    return true;
  }
  return false;

}

export async function gestionar(clientId: string, orden: Orden): Promise<boolean> {

  let receta: Receta | null = null;

  if (orden.recetaid == null) {
    receta = await seleccionarReceta();
    orden.recetaid = receta.id;
    orden.recetanombre = receta.nombre;
    
    
    await ordenRepository.asociarReceta(orden.id, receta.id, receta.nombre);
    

  } else {

    receta = await recetaRepository.getById(orden.recetaid);
  }


  if (receta === null) {
    throw new Error('Receta is null');
  }

  const ingredientesPorReceta: RecetaIngrediente[] = await ingredienteRepository.getByRecetaId(receta.id);
  let ingArgs = ingredientesPorReceta.slice().map((ri: RecetaIngrediente) => ri.ingredienteid);
  const ingredientesEnBodega: ItemBodega[] = await bodegaRepository.getByIngredienteId(ingArgs);
  const ingredientes: Ingrediente[] = await ingredienteRepository.getAllById(ingArgs);
  const ingredientesCopy: Ingrediente[] = ingredientes.slice();

  const itemsFaltantes = await validarStock(ingredientesEnBodega);

  
  const ingredientesFaltantes = itemsFaltantes.map(item => {
    return ingredientes.find(ing => ing.id === item.ingredienteid)!
  });




  if (ingredientesFaltantes.length > 0) {

    const solicitudCompra = { clientid: clientId, ordenid: orden.id, ingredientes: ingredientesFaltantes } as SolicitudCompra;
    return generarSolicitudCompra(solicitudCompra);

  }

  //actualizar stock
  ingredientesCopy.forEach(async (ing: Ingrediente) => {
    return await bodegaRepository.descontarDelStock(ing.id, 1);
  });
  return preparar(clientId, orden);
}



async function preparar(clientId: string, orden: Orden): Promise<boolean> {

  let estado: EstadoOrden = "EN PREPARACION";
  orden.estado = estado;
  const interval = 3000;
  const steps = 3;
  const increment = 90 / steps;
  

  //simular la preparacion de la orden, que a escala son 15 segundos

  for (let percent = 0; percent <= 90; percent += increment) {
    await new Promise(resolve => setTimeout(resolve, interval-1));
    notificarEstadoOrden(clientId, orden, Math.round(percent));
  }


  estado = "FINALIZADA" as EstadoOrden;
  orden.estado = estado;
  await ordenRepository.actualizarEstado(orden.id, estado);
  return notificarEstadoOrden(clientId, orden, 100);


}




async function validarStock(items: ItemBodega[]): Promise<ItemBodega[]> {

  return items
    .filter((ing: ItemBodega) => ing?.cantidaddisponible === 0);
}

async function seleccionarReceta(): Promise<Receta> {
  const recetaRepository = new RecetaRepository();
  const recetas = await recetaRepository.getAll();
  const receta = recetas[indiceAleatorio(0, recetas.length - 1)];
  return receta;
}

const indiceAleatorio = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
