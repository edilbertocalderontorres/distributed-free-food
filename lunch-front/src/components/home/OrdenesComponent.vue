<template>
  <div class="ordenes-container">
    <h2 class="text-2xl font-bold text-white-800 mb-4">📜 Historial de Órdenes</h2>

    <div class="flex flex-col space-y-4 overflow-y-auto max-h-[70vh] p-2">
      <div v-for="orden in ordenes" :key="orden.id ?? 'default-key'" class="orden-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold text-gray-900">{{ orden.recetanombre }}</h3>
          <span :class="estadoClase(orden.estado)">{{ orden.estado }}</span>
        </div>
        <p class="text-sm text-gray-600">
          👤 Beneficiario: <strong>{{ orden.beneficiarioid }}</strong>
        </p>
        <p class="text-sm text-gray-600">📅 Creada: {{ formatearFecha(orden.fechacreacion) }}</p>
        <p class="text-sm text-gray-600">
          🔄 Última actualización: {{ formatearFecha(orden.fechaactualizacion) }}
        </p>
      </div>
    </div>

    <!-- Paginador -->
    <div class="paginador">
      <button @click="cambiarPagina(-1)" :disabled="paginacion.page === 1">Anterior</button>
      <span>Página {{ paginacion.page }}</span>
      <button @click="cambiarPagina(1)" :disabled="(ordenes ?? []).length < paginacion.limit">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerHistorialOrdenes } from '@/services/EndpointService'
import type { Orden } from '@/services/models'

// Estado de las órdenes y paginación
const ordenes = ref<Orden[]>()
const paginacion = ref({ page: 1, limit: 3 })

onMounted(() => cargarOrdenes())

// Función para cargar órdenes con paginación
async function cargarOrdenes() {
  const requestBody = { data: '', paginacion: paginacion.value }
  const response: Response = await obtenerHistorialOrdenes(requestBody)

  let res: { ordenes: Orden[] } = await response.json()
  ordenes.value = res.ordenes
}

// Función para cambiar de página
function cambiarPagina(direccion: number) {
  paginacion.value.page += direccion
  cargarOrdenes()
}

// Asigna clases de color según el estado de la orden
function estadoClase(estado: string) {
  return {
    'text-xs px-2 py-1 rounded-full font-semibold': true,
    'bg-yellow-200 text-yellow-700': estado === 'PENDIENTE',
    'bg-blue-200 text-blue-700': estado === 'EN PREPARACION',
    'bg-green-200 text-green-700': estado === 'FINALIZADA',
  }
}

// Formatea fechas a un formato legible
function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<style scoped>
.ordenes-container {
  max-width: 60%;
  margin: auto;
  padding: 1rem;
  overflow-x: hidden;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  text-align: center;
}

/* Scroll vertical */
.flex.overflow-y-auto {
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

/* Estilos de la tarjeta */
.orden-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease-in-out;
}

.orden-card:hover {
  transform: scale(1.02);
}

/* Paginador */
.paginador {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.paginador button {
  padding: 8px 12px;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.paginador button:disabled {
  background: gray;
  cursor: not-allowed;
}
</style>
