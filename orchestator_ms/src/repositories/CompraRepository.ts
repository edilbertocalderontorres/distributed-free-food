import { query } from "../config/PostgresConfig";
import { Compra } from "../models/models";
import { BaseRepository } from "./Base";

export class CompraRepository extends BaseRepository<Compra> {
    tabla = "compra";
    
    constructor() {
        super("compra");
    }

    async getHistorialCompras(page: number, limit: number): Promise<any[]> {
        const offset = (page - 1) * limit;
        const result = await query(`SELECT c.*,i.nombre FROM public.${this.tabla} c
            INNER JOIN public.ingrediente i ON c.ingredienteid = i.id
            ORDER BY c.fechacompra DESC`, [limit, offset]);
        return result.rows as {nombre:string, compra:any}[];
    }
}