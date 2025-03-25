import axios from "axios";
import dotenv from "dotenv";
import { Compra, Ingrediente, RespuestaCompra, SolicitudCompra } from '../models/models';
import { EventEmitter } from "events";
import { BodegaRepository } from "../repositories/BodegaRepository";
import { notificarRespuestaCompra } from './PublicarRespuestaCompra';
import { CompraRepository } from "../repositories/CompraRepository";
import { foodMap } from "../models/constants";

dotenv.config();
const emitter = new EventEmitter();
const bodegaRepository = new BodegaRepository();
const compraRepository = new CompraRepository();

const urlBase = process.env.API_PLAZA_MERCADO_URL_BASE || '';

export async function iniciar(solicitud: SolicitudCompra): Promise<void> {
    // Se crea un contexto exclusivo para este mensaje
    const contexto = {
        ingredientesAcomprar: solicitud.ingredientes,
        ingredientesComprados: new Set<Ingrediente>(),
        facturasCompra: new Set<Compra>(),
        ordenid: solicitud.ordenid,
        client: solicitud.clientid
    }as ContextoCompra;

    await Promise.all(
        solicitud.ingredientes.map((ingre) => comprar(ingre, 1, contexto))
    );
}

export async function comprar(ingrediente: Ingrediente, intentos: number, contexto: any): Promise<boolean> {
    let ingredienteParam = foodMap.get(ingrediente.nombre);
    let url = `${urlBase}?ingredient=${ingredienteParam}`;

    const res = await axios.get(url);
    let body = res.data as { quantitySold: number };

    if (body.quantitySold > 0) {
        let compra: Compra = {
            id: "",
            cantidadcomprada: body.quantitySold,
            fechacompra: new Date(),
            ingredienteid: ingrediente.id
        };

        contexto.ingredientesComprados.add(ingrediente);
        contexto.facturasCompra.add(compra);
        emitter.emit("compraExitosa", contexto);

        return true;
    }

    intentos++;
    emitter.emit("compraFallida", ingrediente, intentos, contexto);
    return false;
}

async function verificarCompras(contexto: any): Promise<void> {
    if (contexto.ingredientesComprados.size === contexto.ingredientesAcomprar.length) {
        let compras: Compra[] = await Promise.all(
            Array.from(contexto.facturasCompra as Set<Compra> ).map(async (fac:Compra) => compraRepository.create(fac))
        );

        await Promise.all(
            compras.map(async (compra) => {
                await bodegaRepository.actualizarStock(compra.ingredienteid, compra.cantidadcomprada);
            })
        );

        notificarRespuestaCompra({
            clientid: contexto.client,
            ordenid: contexto.ordenid,
            compra: Array.from(contexto.facturasCompra)
        } as RespuestaCompra);
    }
}

emitter.on("compraExitosa", (contexto) => {
    verificarCompras(contexto);
});

emitter.on("compraFallida", (ingrediente: Ingrediente, intentos, contexto) => {
    if (intentos < 10) {
        setTimeout(async () => {
            await comprar(ingrediente, intentos, contexto);
        }, 2000);
    } else {
        console.log(`No se pudo comprar el ingrediente ${ingrediente.nombre}`);
    }
});

export interface ContextoCompra {
    ingredientesAcomprar: Ingrediente[];
    ingredientesComprados: Set<Ingrediente>;
    facturasCompra: Set<Compra>;
    ordenid: string;
    client: string;
  }

