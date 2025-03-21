import { Orden } from "../models/models";
import { OrdenRepository } from "../repositories/OrdenRepository";
export async function prepararNuevoPlato(orden: Orden) {
    const repository= new OrdenRepository();
    return repository.create(orden)};