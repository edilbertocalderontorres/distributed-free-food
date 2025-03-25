import { BaseRepository } from "./Base";
import { Ingrediente, RecetaIngrediente, UUID } from '../models/models';
import { query } from "../config/PostgresConfig";
import format from "pg-format"

export class IngredienteRepository extends BaseRepository<Ingrediente> {
    tabla = "ingrediente";

    constructor() {
        super("ingrediente");
    }

    async getAllById(id: UUID[]): Promise<Ingrediente[]> {

        const result = await query(format(`SELECT * FROM %I t WHERE t.id IN (%L)`, `${this.tabla}`, id));

        return result.rows as Ingrediente[];
    }

    async getAll(): Promise<Ingrediente[]> {
        const result = await query(`SELECT * FROM public.${this.tabla}`);
        return result.rows as Ingrediente[];
    }

    async getByRecetaId(recetaId: string): Promise<RecetaIngrediente[]> {
        const result = await query(`SELECT * FROM public.receta_ingrediente r WHERE recetaId = $1`, [recetaId]);


        return result.rows as RecetaIngrediente[];
    }



}