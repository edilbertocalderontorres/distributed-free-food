

import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';
import { RecetaRepository } from '../repositories/RecetaRepository';
import { Receta, Orden, Ingrediente, EstadoOrden, SolicitudCompra, EventoNuevaOrden } from '../models/models';
import { IngredienteRepository } from '../repositories/IngredienteRepository';
import { BodegaRepository } from '../repositories/BodegaRepository';
import { generarSolicitudCompra } from './SolicitudCompraService';
import { OrdenRepository } from '../repositories/OrdenRepository';
import dotenv from 'dotenv';
import { notificarEstadoOrden } from './NotificacionOrdenFinalizada';
import { time } from 'console';

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
        gestionar(evt.clientId, evt.orden).then();
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

  if (orden.recetaId == null) {
    receta = await seleccionarReceta();
    ordenRepository.asociarReceta(orden.id, receta.id).then(() => {
      console.log(`Receta asociada a la orden ${orden.id}`);
    });

  } else {

    receta = await recetaRepository.getById(orden.recetaId);
  }


  if (receta === null) {
    throw new Error('Receta is null');
  }

  const ingredientes: Ingrediente[] = await ingredienteRepository.getByRecetaId(receta.id);

  const ingredientesFaltantes = await validarStock(ingredientes);



  if (ingredientesFaltantes.length > 0) {

    const solicitudCompra = { clientId: clientId, ordenId: orden.id, ingredientes: ingredientesFaltantes } as SolicitudCompra;


    return generarSolicitudCompra(solicitudCompra);


  }

  return preparar(clientId, orden);
}

export async function preparar(clientId: string, orden: Orden): Promise<boolean> {



  let estado: EstadoOrden = "EN PREPARACION";
  orden.estado = estado;
  const interval = 5000;
  const steps = 3; 
  const increment = 90 / steps; 

  for (let percent = 0; percent <= 90; percent += increment) {
      await new Promise(resolve => setTimeout(resolve, interval)); 
      notificarEstadoOrden(clientId, orden, Math.round(percent));
  }

  // Luego de los 15s, enviar el 100%
  estado = "FINALIZADA" as EstadoOrden;
  ordenRepository.actualizarEstado(orden.id, estado);
  orden.estado = estado;
  return notificarEstadoOrden(clientId, orden, 100);

  
  }
  



async function validarStock(ingredientes: Ingrediente[]): Promise<Ingrediente[]> {
  
  const stockDisponibles = await Promise.all(
    ingredientes.map(async (ingrediente) => {
      const ing = await bodegaRepository.getByIngredienteId(ingrediente.id);
      return { ingrediente, ing };
    })
  );

  
  return stockDisponibles
    .filter(({ ing }) => ing?.cantidaddisponible === 0) 
    .map(({ ingrediente }) => ingrediente);
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
