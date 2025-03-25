import { query } from "../config/PostgresConfig";
import { Ingrediente } from "../models/models";
import { BaseRepository } from "./Base";

export class IngredienteRepository extends BaseRepository<Ingrediente> {
    tabla = "ingrediente";
    
    constructor() {
        super("ingrediente");
    }

    
}