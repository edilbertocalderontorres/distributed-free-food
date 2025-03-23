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

export interface ItemBodega {
  ingredienteId: UUID;
  cantidadDisponible: number;
}


export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export interface Orden {
  id: UUID;
  beneficiarioId: string;
  recetaId: UUID | null;
  estado: EstadoOrden;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Compra {
  id: UUID;
  ingredienteId: UUID;
  cantidadComprada: number;
  fechaCompra: Date;
}

export interface SolicitudCompra {
  ordenId: UUID;
  ingredientes: Ingrediente[];
}

export interface RespuestaCompra {
  ordenId: UUID;

  compra: Compra;

}
