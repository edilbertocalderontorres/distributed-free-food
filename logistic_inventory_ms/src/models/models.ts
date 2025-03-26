export type UUID = string;

export interface Beneficiario {

  beneficiario: {
    tipoDocumento: string;
    numDocumento: string;
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

export interface RecetaIngrediente {
  recetaid: UUID;
  ingredienteid: UUID;
  cantidad: number;
}

export interface ItemBodega {
  ingredienteid: UUID;
  cantidadDisponible: number;
}


export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export interface Orden {
  id: UUID;
  beneficiarioid: string;
  recetaid: UUID | null;
  recetanombre: string | null;
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

export interface SolicitudCompra {
  clientid: string;
  ordenid: UUID;
  ingredientes: Ingrediente[];
}

export interface RespuestaCompra {
  clientid: string;
  ordenid: UUID;
  compra: Compra[];

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
