import { BaseRepository } from "./Base";
import { Orden } from '../models/models';
import { query } from "../config/PostgresConfig";
export class OrdenRepository extends BaseRepository<Orden> {
    tabla = "orden";
    
  constructor() {
    
    super("orden");
  }

  async create(data: Orden): Promise<Orden> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const result = await query(
      `INSERT INTO ${this.tabla} (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`,
      values
    );
    return result.rows[0] as Orden;
  }
    
}