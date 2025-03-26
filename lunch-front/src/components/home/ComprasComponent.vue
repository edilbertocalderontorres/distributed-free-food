<template>
  <div class="compras-container">
    <h2 class="text-2xl font-bold text-white-800 mb-4">🛒 Historial de Compras</h2>

    <div class="scroll-box">
      <ul>
        <li v-for="compra in compras" :key="compra.id" class="compra-item">
          <span class="text-lg">{{ obtenerIcono(compra.nombre) }}</span>
          <span class="text-gray-800">{{ compra.nombre }}</span>
          <span class="cantidad">{{ compra.cantidadcomprada }} unidades</span>
          <span class="fecha">{{ formatearFecha(compra.fechacompra) }}</span>
        </li>
      </ul>
    </div>

    <!-- Paginador -->
    <div class="paginador">
      <button @click="cambiarPagina(-1)" :disabled="paginacion.page === 1">Anterior</button>
      <span>Página {{ paginacion.page }}</span>
      <button @click="cambiarPagina(1)" :disabled="(compras ?? []).length < paginacion.limit">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerHistorialCompras } from '@/services/EndpointService'

// Estado de compras
const compras = ref<
  {
    nombre: string
    ingredienteid: string
    cantidadcomprada: number
    fechacompra: string
    id: string
  }[]
>([])

const paginacion = ref({ page: 1, limit: 5 })

onMounted(async () => {
  cargarCompras()
})

async function cargarCompras() {
  const response = await obtenerHistorialCompras({ paginacion: paginacion.value })
  compras.value = response.compras
}
// Asignar iconos a ingredientes
function obtenerIcono(ingrediente: string): string {
  const iconos: Record<string, string> = {
    Lechuga: '🥬',
    Queso: '🧀',
    Pollo: '🍗',
    Tomate: '🍅',
    Arroz: '🍚',
    Cebolla: '🧅',
    Papa: '🥔',
    Carne: '🥩',
    Ketchup: '🍅',
    Limon: '🍋',
  }
  return iconos[ingrediente] || '❓'
}

function cambiarPagina(direccion: number) {
  paginacion.value.page += direccion
  cargarCompras()
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<style scoped>
.compras-container {
  max-width: 100%;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

/* Scroll vertical */
.scroll-box {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}

.compra-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cantidad {
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
}

.fecha {
  font-size: 0.9rem;
  color: gray;
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
