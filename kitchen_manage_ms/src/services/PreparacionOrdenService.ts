

import { obtenerRabbitChannel } from '../events/listener/RabbitEventListener';
import { RecetaRepository } from '../repositories/RecetaRepository';
import { Receta, Orden, Ingrediente, EstadoOrden, SolicitudCompra } from '../models/models';
import { IngredienteRepository } from '../repositories/IngredienteRepository';
import { BodegaRepository } from '../repositories/BodegaRepository';
import { generarSolicitudCompra } from './SolicitudCompraService';
import { OrdenRepository } from '../repositories/OrdenRepository';
import dotenv from 'dotenv';
import { notificarOrdenFinalizada } from './NotificacionOrdenFinalizada';

dotenv.config();
const ingredienteRepository = new IngredienteRepository();
const bodegaRepository = new BodegaRepository();
const ordenRepository = new OrdenRepository();
const recetaRepository = new RecetaRepository();



export async function suscribirEventoNuevaOrden(): Promise<boolean> {

  const queue = process.env.NUEVA_ORDEN_QU || '';

  const channel = await obtenerRabbitChannel(queue);




  channel.consume(
    queue,
    (msg) => {
      if (msg) {

        const orden: Orden = JSON.parse(msg.content.toString());
        gestionar(orden).then();


        console.log(` Mensaje recibido: ${orden}`);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );

  if (channel.connection) {
    return true;
  }
  return false;

}

export async function gestionar(orden: Orden): Promise<boolean> {

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

    const solicitudCompra = { ordenId: orden.id, ingredientes: ingredientesFaltantes } as SolicitudCompra;


    return generarSolicitudCompra(solicitudCompra);


  }

  return preparar(orden);
}

export async function preparar(orden: Orden): Promise<boolean> {



  let estado: EstadoOrden = "PREPARANDO" as EstadoOrden;

  setInterval(() => {
    estado = "FINALIZADA" as EstadoOrden;
    ordenRepository.actualizarEstado(orden.id, estado);
    orden.estado = estado;
    return notificarOrdenFinalizada(orden);
  }, 30000);

  return false;
}


async function validarStock(ingredientes: Ingrediente[]): Promise<Ingrediente[]> {


  return ingredientes
    .filter(async ingrediente => (await bodegaRepository.getByIngredienteId(ingrediente.id))
      .cantidadDisponible == 0);
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
