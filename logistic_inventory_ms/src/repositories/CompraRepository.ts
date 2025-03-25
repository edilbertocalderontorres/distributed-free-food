import { BaseRepository } from "./Base";
import { Compra, UUID } from '../models/models';
import { query } from "../config/PostgresConfig";
import format from "pg-format";

export class CompraRepository extends BaseRepository<Compra> {

    tabla = "compra";

    constructor() {
        super("compra");
    }


    async create(compra: Compra): Promise<Compra> {
        const result = await query(`INSERT INTO public.${this.tabla} ( ingredienteid, cantidadcomprada, fechacompra) VALUES ($1, $2, $3) RETURNING *`, [compra.ingredienteid, compra.cantidadcomprada, compra.fechacompra]);
        return result.rows[0] as Compra;
    }
}