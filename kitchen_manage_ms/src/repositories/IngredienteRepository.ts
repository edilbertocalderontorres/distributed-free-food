import { BaseRepository } from "./Base";
import { Ingrediente } from '../models/models';
import { query } from "../config/PostgresConfig";
export class IngredienteRepository extends BaseRepository<Ingrediente> {
    tabla = "ingrediente";

    constructor() {
        super("ingrediente");
    }

    async getById(id: string): Promise<Ingrediente | null> {
        const result = await query(`SELECT * FROM public.${this.tabla} WHERE id = $1`, [id]);
        return result.rows[0] as Ingrediente || null;
    }

    async getAll(): Promise<Ingrediente[]> {
        const result = await query(`SELECT * FROM public.${this.tabla}`);
        return result.rows as Ingrediente[];
    }

    async getByRecetaId(recetaId: string): Promise<Ingrediente[]> {
        const result = await query(`SELECT * FROM public.${this.tabla} WHERE recetaId = $1`, [recetaId]);
        return result.rows as Ingrediente[];
    }



}