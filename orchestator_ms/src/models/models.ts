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

export interface Bodega {
  ingredienteid: UUID;
  cantidaddisponible: number;
}

export interface Plato {
  id: UUID;
  recetaid: UUID | null;
  ingredienteid: UUID | null;
  cantidad: number;
}

export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export interface Orden {
  id: UUID;
  beneficiarioid: string;
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
