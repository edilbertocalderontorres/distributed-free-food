import { query } from "./../config/PostgresConfig";

export class BaseRepository<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(limit: number = 10, offset: number = 0): Promise<T[]> {
    const result = await query(
      `SELECT * FROM ${this.tableName} ORDER BY id LIMIT $1 OFFSET $2`, 
      [limit, offset]
    );
    return result.rows as T[];
  }

  async getById(id: string): Promise<T | null> {
    const result = await query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    return result.rows[0] as T || null;
  }

  
}
