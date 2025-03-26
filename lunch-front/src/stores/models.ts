

export class WsEventMessage {
  tipo: WsTipoEvento;
  data: EventoEstado;

  constructor(tipo: WsTipoEvento, data: EventoEstado) {
    this.tipo = tipo;
    this.data = data;
  }
}
export interface RecetaAgrupada {
  nombre: string, descripcion: string,
  ingredientes: IngredienteAgrupado[]
}

export interface IngredienteAgrupado { ingrediente: string, cantidad: number, ingredienteid: string }

export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export type UUID = string;
export interface Orden {
  id: UUID;
  recetanombre: string;
  beneficiarioid: string;
  recetaid: UUID | null;
  estado: EstadoOrden;
  fechacreacion: string;
  fechaactualizacion: string;
}

export interface EventoEstado {
  clientid: string;
  orden: Orden;
  porcentaje: number;
}

export type WsTipoEvento = 'estado' | 'error';




