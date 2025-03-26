
import { query } from "../config/PostgresConfig";
import { Compra } from "../models/models";
import { BaseRepository } from "./Base";
import format from "pg-format";

export class CompraRepository extends BaseRepository<Compra> {
    tabla = "compra";
    
    constructor() {
        super("compra");
    }

    async getHistorialCompras(page: number, limit: number): Promise<any> {
        const offset = (page - 1) * limit;


        let sql=`SELECT c.id, c.ingredienteid, c.cantidadcomprada, c.fechacompra, i.nombre FROM public.compra c inner JOIN public.ingrediente i ON c.ingredienteid = i.id
        ORDER BY c.fechacompra DESC LIMIT $1 OFFSET $2`;
        
      
        const result = await query(sql,[limit, offset]);
        return result.rows as any;
    }
}