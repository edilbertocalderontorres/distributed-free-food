import { query } from "../config/PostgresConfig";
import { Receta } from "../models/models";
import { BaseRepository } from "./Base";

export class RecetaRepository extends BaseRepository<Receta> {
    tabla = "receta";
    
    constructor() {
        super("receta");
    }

    async obtenerRecetas(): Promise<Receta[]> {
        const result = await query(`SELECT * FROM public.${this.tabla}`);
        return result.rows as Receta[];
    }
}