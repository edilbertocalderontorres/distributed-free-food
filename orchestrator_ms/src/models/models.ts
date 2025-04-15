export type UUID = string;

export interface Beneficiario {

  beneficiario: {
    tipodocumento: string;
    numdocumento: string;
  }

}



export interface Receta {
  id: UUID;
  nombre: string;
  descripcion: string;
}

export interface Ingrediente {
  id: UUID;
  nombre: string;
}

export interface ItemBodega {
  ingredienteid: UUID;
  cantidaddisponible: number;
}

export interface Plato {
  id: UUID;
  recetaid: UUID | null;
  ingredienteid: UUID | null;
  cantidad: number;
}

export interface RecetaIngrediente { receta: string, ingrediente: string, descripcion: string, ingredienteid: string, cantidad: number }



export interface RecetaAgrupada {
  nombre: string, descripcion: string,
  ingredientes: IngredienteAgrupado[]
}

export interface IngredienteAgrupado { ingrediente: string, cantidad: number, ingredienteid: string }


export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export interface Orden {
  id: UUID;
  beneficiarioid: string;
  recetanombre: string | null;
  recetaid: UUID | null;
  estado: EstadoOrden;
  fechacreacion: Date;
  fechaactualizacion: Date;
}

export interface Compra {
  id: UUID;
  ingredienteid: UUID;
  cantidadcomprada: number;
  fechacompra: Date;
}

export interface EventoEstado {
  clientid: string;
  orden: Orden;
  porcentaje: number;
}

export interface EventoNuevaOrden {
  orden: Orden;
  clientid: string;
}
export interface Paginacion {
  page: number;
  limit: number;
}

export interface ListaCompras {

  compras: ItemListaCompras[];
}

export interface ItemListaCompras {
  nombre: string, ingredienteid: string, cantidadcomprada: number, fechacompra: string, id: string
}


export interface Inventario { inventario: InventarioItem[] }

export interface InventarioItem { nombre: string, cantidaddisponible: number }
