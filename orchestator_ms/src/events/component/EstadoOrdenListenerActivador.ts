import { EstadoOrden } from '../../models/models';
import { suscribirActualizacionEstado } from '../../services/ManejaEventoEstadoOrdenService';

export class EstadoOrdenListenerActivador {


    constructor() {
        this.activar();
    }

    public activar() {
        suscribirActualizacionEstado().then();
    }
}