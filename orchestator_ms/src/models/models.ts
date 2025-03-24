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

export interface Bodega {
  ingredienteId: UUID;
  cantidadDisponible: number;
}

export interface Plato {
  id: UUID;
  recetaId: UUID | null;
  ingredienteId: UUID | null;
  cantidad: number;
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

export interface EventoEstado {
  clientId: string;
  orden: Orden;
  porcentaje: number;
}

export interface EventoNuevaOrden {
  orden: Orden;
  clientId: string;
}
