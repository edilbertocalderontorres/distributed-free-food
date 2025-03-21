import { Pool } from "pg";
import dotenv from "dotenv";


const pool = new Pool({
  user: dotenv.config().parsed?.PG_USER,
  host: dotenv.config().parsed?.PG_HOST,
  database: dotenv.config().parsed?.PG_DATABASE,
  password: dotenv.config().parsed?.PG_PASSWORD,
  port:  Number(dotenv.config().parsed?.PG_PORT), 
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
