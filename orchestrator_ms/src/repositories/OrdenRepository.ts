import { BaseRepository } from "./Base";
import { Orden } from '../models/models';
import { query } from "../config/PostgresConfig";
export class OrdenRepository extends BaseRepository<Orden> {
  tabla = "orden";

  constructor() {

    super("orden");
  }

  async create(data: Orden): Promise<Orden> {
    const values = [
      data.beneficiarioid,
      data.recetaid,
      data.estado

    ];


    const result = await query(
      `INSERT INTO public.orden (beneficiarioid, recetaid, estado, fechacreacion, fechaactualizacion)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *`,
      values
    );
    return result.rows[0] as Orden;
  }

  async getByBeneficiarioId(beneficiarioId: string): Promise<Orden | null> {
    const result = await query(`SELECT * FROM public.${this.tabla} WHERE beneficiarioid = $1 ORDER BY fechaactualizacion DESC limit 1`, [beneficiarioId]);
    return result.rows[0] as Orden || null;
  }

  async getHistorialPedidos(page: number, limit: number): Promise<any[]> {
    const offset = (page - 1) * limit;
    const result = await query(`SELECT CASE 
        WHEN o.recetanombre IS NULL THEN 'Receta en espera de asignación'
        ELSE r.nombre
    END AS recetanombre, o.id, o.beneficiarioid, o.estado, o.fechacreacion, o.fechaactualizacion
        FROM ${this.tabla} o 
      LEFT JOIN receta r ON r.id = o.recetaid
      ORDER BY o.fechaactualizacion DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return result.rows as { orden: Orden }[];
  }

}