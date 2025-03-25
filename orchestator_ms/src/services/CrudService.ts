import { OrdenRepository } from "../repositories/OrdenRepository";
import { IngredienteRepository } from "../repositories/IngredienteRepository";
import { CompraRepository } from "../repositories/CompraRepository";
import { RecetaRepository } from "../repositories/RecetaRepository";
import { BodegaRepository } from "../repositories/BodegaRepository";
import dotenv from 'dotenv';
import { Orden, Ingrediente, Compra, Receta, Paginacion } from '../models/models';


dotenv.config();

export async function obtenerEstadoOrdenes(): Promise<Orden[]> {
    const repository = new OrdenRepository();
    return await repository.getHistorialPedidos(1, 50); 
}

export async function obtenerHistorialPedidos(paginacion:Paginacion): Promise<Orden[]> {
    const repository = new OrdenRepository();
    return await repository.getHistorialPedidos(paginacion.page, paginacion.limit);
}

export async function obtenerInventario(): Promise<Ingrediente[]> {
    const repository = new BodegaRepository();
    return await repository.obtenerInventario();
}

export async function obtenerHistorialCompras(paginacion:Paginacion): Promise<Compra[]> {
    const repository = new CompraRepository();
    return await repository.getHistorialCompras(paginacion.page, paginacion.limit);
}

export async function obtenerRecetas(): Promise<Receta[]> {
    const repository = new RecetaRepository();
    return await repository.obtenerRecetas();
}