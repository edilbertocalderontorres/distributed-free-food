import { query } from "../config/PostgresConfig";
import { Receta, RecetaIngrediente } from "../models/models";
import { BaseRepository } from "./Base";

export class RecetaRepository extends BaseRepository<Receta> {
    tabla = "receta";

    constructor() {
        super("receta");
    }

    async obtenerRecetas(): Promise<RecetaIngrediente[]> {
        const result = await query(`SELECT re.nombre as receta, re.descripcion, ri.cantidad, ri.ingredienteid, i.nombre as ingrediente FROM public.receta_ingrediente ri
INNER JOIN public.receta re ON ri.recetaid = re.id 
INNER JOIN public.ingrediente i ON ri.ingredienteid = i.id

            `);
        return result.rows as RecetaIngrediente[];
    }
}