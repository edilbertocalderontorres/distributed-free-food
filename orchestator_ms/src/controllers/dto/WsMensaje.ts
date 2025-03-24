import { WsTipoEvento } from "./WsTipoEvento";

export class WsEventMessaje {
    tipo: WsTipoEvento;
    data: any;

    constructor(tipo: WsTipoEvento, data: string) {
        this.tipo = tipo;
        this.data = data;
    }
}