

export class WsEventMessage {
  tipo: WsTipoEvento;
  data: EventoEstado;

  constructor(tipo: WsTipoEvento, data: EventoEstado) {
    this.tipo = tipo;
    this.data = data;
  }
}

export type EstadoOrden = "PENDIENTE" | "EN PREPARACION" | "FINALIZADA";

export type UUID = string;
export interface Orden {
  id: UUID;
  beneficiarioid: string;
  recetaid: UUID | null;
  estado: EstadoOrden;
  fechacreacion: Date;
  fechaactualizacion: Date;
}

export interface EventoEstado {
  clientid: string;
  orden: Orden;
  porcentaje: number;
}

export type WsTipoEvento = 'estado' | 'error';


export class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: WebSocket;
  private WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/";

  private userid = "randomClientId1";

  private onMessageCallback: ((mensaje: WsEventMessage) => void) | null = null;

  private constructor() {
    this.socket = new WebSocket(`${this.WS_URL}${this.userid}`);
    this.initWebSocket();
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  private initWebSocket(): void {
    this.socket.onopen = () => {
      console.log("WebSocket conectado a:", this.WS_URL);
    };

    this.socket.onmessage = (event) => {
      try {
        const mensaje: WsEventMessage = JSON.parse(event.data);
        if (this.onMessageCallback && mensaje.tipo === "estado") {
          this.onMessageCallback(mensaje);
        }
      } catch (error) {
        console.error("Error procesando mensaje WS:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.socket.onclose = () => {
      console.warn("WebSocket desconectado. Intentando reconectar en 5s...");
      setTimeout(() => {
        location.reload(); // Recargar para restablecer conexión
      }, 5000);
    };
  }

  public setOnMessageCallback(callback: (mensaje: WsEventMessage) => void): void {
    this.onMessageCallback = callback;
  }
}
