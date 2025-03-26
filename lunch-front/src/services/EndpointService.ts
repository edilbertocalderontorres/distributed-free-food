import type { RecetaAgrupada } from "@/stores/models";
import { apiFetch } from "./ApiServiceBase";

export async function crearOrden(tipoDocumento: string, numDocumento: string) {
  return apiFetch("/orden", {
    method: "POST",
    body: JSON.stringify({ beneficiario: { numdocumento: numDocumento, tipodocumento: tipoDocumento } }),
  });
}

export async function obtenerHistorialOrdenes(data: any) {
  return apiFetch("/ordenes/historial", { method: "POST", body: JSON.stringify(data) });
}



export async function obtenerStockBodega() {
  return apiFetch("/bodega/inventario");
}


export async function obtenerHistorialCompras(data:any) {
  return apiFetch("/compras/historial", { method: "POST", body: JSON.stringify(data) });
}

export async function obtenerRecetas(): Promise<{ recetas: RecetaAgrupada[] }> {
  return apiFetch("/recetas");
}
