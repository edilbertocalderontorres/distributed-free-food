import { BaseRepository } from "./Base";
import { EstadoOrden, Orden } from '../models/models';
import { query } from "../config/PostgresConfig";
export class OrdenRepository extends BaseRepository<Orden> {
    tabla = "orden";
    
  constructor() {
    
    super("orden");
  }

  async create(data: Orden): Promise<Orden> {
    const values = [
      data.beneficiarioid,
      data.recetanombre,
      data.recetaid,
      data.estado,
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

  async actualizarEstado(ordenId: string, estado: EstadoOrden): Promise<void> {

    await query(`UPDATE public.${this.tabla} SET estado = $1, fechaactualizacion = NOW() WHERE id = $2`, [estado, ordenId]);
  }

  async asociarReceta(ordenId: string, recetaId: string, recetaNombre:string): Promise<void> {
    await query(`UPDATE public.${this.tabla} SET recetaid = $1, recetanombre=$2, fechaactualizacion = NOW() WHERE id = $3`, [recetaId,recetaNombre, ordenId]);
  }
    
}