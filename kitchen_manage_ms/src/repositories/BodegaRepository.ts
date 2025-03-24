import { BaseRepository } from "./Base";
import { ItemBodega, UUID } from '../models/models';
import { query } from "../config/PostgresConfig";
import format from "pg-format"

export class BodegaRepository extends BaseRepository<ItemBodega> {

    tabla = "bodega";

    constructor() {

        super("bodega");
    }





    async getByIngredienteId(ingredienteId: UUID[]): Promise<ItemBodega[]> {

        const result = await query(format(`SELECT * FROM %I t WHERE t.ingredienteId IN (%L)`, `${this.tabla}`, ingredienteId));
        return result.rows as ItemBodega[];
    }

    async getstockByIngredienteId(ingredienteId: string): Promise<number> {
        const result = await query(`SELECT cantidadDisponible FROM public.${this.tabla} WHERE ingredienteId = $1`, [ingredienteId]);
        return result.rows[0].cantidadDisponible as number;
    }

    async actualizarStock(ingredienteId: string, cantidad: number): Promise<boolean> {

        const result = await query(
            `UPDATE public.${this.tabla} 
             SET cantidaddisponible = GREATEST(0, cantidaddisponible - $1)
             WHERE ingredienteid = $2 
             RETURNING cantidaddisponible`,
            [cantidad, ingredienteId]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    async create(item: ItemBodega): Promise<ItemBodega> {
        const result = await query(`INSERT INTO public.${this.tabla} (ingredienteId, cantidadDisponible) VALUES ($1, $2) RETURNING *`, [item.ingredienteid, item.cantidadDisponible]);
        return result.rows[0] as ItemBodega;
    }

}