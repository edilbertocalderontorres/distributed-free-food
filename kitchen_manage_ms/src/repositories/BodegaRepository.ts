import { BaseRepository } from "./Base";
import { ItemBodega } from '../models/models';
import { query } from "../config/PostgresConfig";
export class BodegaRepository extends BaseRepository<ItemBodega> {

    tabla = "bodega";

    constructor() {

        super("bodega");
    }

   

   

    async getByIngredienteId(ingredienteId: string): Promise<ItemBodega> {
        const result = await query(`SELECT * FROM public.${this.tabla} WHERE ingredienteId = $1`, [ingredienteId]);
        return result.rows[0] as ItemBodega;
    }

    async getstockByIngredienteId(ingredienteId: string): Promise<number> {
        const result = await query(`SELECT cantidadDisponible FROM public.${this.tabla} WHERE ingredienteId = $1`, [ingredienteId]);
        return result.rows[0].cantidadDisponible as number;
    }

    async actualizarStock(ingredienteId: string, cantidad: number): Promise<void> {
        await query(`UPDATE public.${this.tabla} SET cantidadDisponible = cantidadDisponible - $1 WHERE ingredienteId = $2`, [cantidad, ingredienteId]);
    }

    async create(item: ItemBodega): Promise<ItemBodega> {
        const result = await query(`INSERT INTO public.${this.tabla} (ingredienteId, cantidadDisponible) VALUES ($1, $2) RETURNING *`, [item.ingredienteId, item.cantidaddisponible]);
        return result.rows[0] as ItemBodega;
    }

}