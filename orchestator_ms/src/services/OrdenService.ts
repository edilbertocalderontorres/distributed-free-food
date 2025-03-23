import { Orden } from "../models/models";
import { OrdenRepository } from "../repositories/OrdenRepository";
export async function registrar(orden: Orden) {
    const repository= new OrdenRepository();
    return repository.create(orden)};