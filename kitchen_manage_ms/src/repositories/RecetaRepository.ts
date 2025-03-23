import { Receta } from '../models/models';
import { query } from "../config/PostgresConfig";
import { BaseRepository } from "./Base";
export class RecetaRepository extends BaseRepository<Receta> {

    tabla = "receta";

    constructor() {

        super("receta");
    }

  

    async getById(id: string): Promise<Receta | null> {
        const result = await query(`SELECT * FROM public.${this.tabla} WHERE id = $1`, [id]);
        return result.rows[0] as Receta || null;
    }

    async getAll(): Promise<Receta[]> {
        const result = await query(`SELECT * FROM public.${this.tabla}`);
        return result.rows as Receta[];
    }

    async getByRecetaId(recetaId: string): Promise<Receta[] | null> {
        const result = await query(`SELECT * FROM public.${this.tabla} WHERE recetaId = $1`, [recetaId]);
        return result.rows[0] as Receta[] || null;
    }




}
