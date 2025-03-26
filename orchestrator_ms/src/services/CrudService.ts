import { OrdenRepository } from "../repositories/OrdenRepository";
import { IngredienteRepository } from "../repositories/IngredienteRepository";
import { CompraRepository } from "../repositories/CompraRepository";
import { RecetaRepository } from "../repositories/RecetaRepository";
import { BodegaRepository } from "../repositories/BodegaRepository";
import dotenv from 'dotenv';
import { Orden, Ingrediente, Compra, Receta, Paginacion, RecetaIngrediente, RecetaAgrupada } from '../models/models';




dotenv.config();

export async function obtenerEstadoOrdenes(): Promise<Orden[]> {
    const repository = new OrdenRepository();
    return await repository.getHistorialPedidos(1, 50);
}

export async function obtenerHistorialPedidos(paginacion: Paginacion): Promise<{ordenes:{ nombre: string, orden: Orden }[]}> {
    const repository = new OrdenRepository();

    let ordenes = await repository.getHistorialPedidos(paginacion.page, paginacion.limit)
    return{ ordenes};
}

export async function obtenerInventario(): Promise<{inventario:{nombre: string, cantidaddisponible: number}[]}> {
    const repository = new BodegaRepository();
    let inventario=await repository.obtenerInventario()
    return {inventario};
}

export async function obtenerHistorialCompras(paginacion: Paginacion): Promise<{compras:{nombre:string,ingredienteid:string, cantidadcomprada:number,fechacompra:string, id:string}[]}> {
    const repository = new CompraRepository();
    let compras = await repository.getHistorialCompras(paginacion.page, paginacion.limit);
    return {compras};
    
}

export async function obtenerRecetas(): Promise<any> {
    const repository = new RecetaRepository();
    let ingredientesPorReceta = await repository.obtenerRecetas();

    let setRecetas = new Set<string>();
    ingredientesPorReceta.forEach((receta: RecetaIngrediente) => {

        setRecetas.add(receta.receta);

    });

    let recetas: RecetaAgrupada[] = [];

    setRecetas.forEach((receta: string) => {
        let ingrCategoria = ingredientesPorReceta.filter((recetaIngrediente: RecetaIngrediente) => recetaIngrediente.receta === receta);

        let ingredientes = ingrCategoria.map((ri: RecetaIngrediente) => { return { ingrediente: ri.ingrediente, cantidad: ri.cantidad, ingredienteid: ri.ingredienteid } });

        ingrCategoria.forEach((ri: RecetaIngrediente) => {

            let recetaAgrupada: RecetaAgrupada = { nombre: receta, descripcion: ri.descripcion, ingredientes: ingredientes };
            if (!recetas.find(receta => receta.nombre === recetaAgrupada.nombre))
                recetas.push(recetaAgrupada);
        });


    });
    return { recetas };
}



