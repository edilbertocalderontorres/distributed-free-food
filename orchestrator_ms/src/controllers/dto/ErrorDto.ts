
export class ErrorDto {
  error: string;
  mensaje: string;

  constructor(error: string, mensaje: string) {
    this.error = error;
    this.mensaje = mensaje;
  }
}