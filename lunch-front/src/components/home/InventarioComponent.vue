<template>
  <div class="inventario-container">
    <h2 class="text-2xl font-bold text-white-800 mb-4">📦 Inventario de Bodega</h2>

    <div class="scroll-box">
      <ul>
        <li v-for="item in inventario" :key="item.nombre" class="inventario-item">
          <span class="text-lg">{{ obtenerIcono(item.nombre) }}</span>
          <span class="text-gray-800">{{ item.nombre }}</span>
          <span class="cantidad">{{ item.cantidaddisponible }} en stock</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerStockBodega } from '@/services/EndpointService'

// Estado para el inventario
const inventario = ref<{ nombre: string; cantidaddisponible: number }[]>([])

onMounted(async () => {
  const response: { inventario: { nombre: string; cantidaddisponible: number }[] } =
    await obtenerStockBodega()
  inventario.value = response.inventario
})

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
</script>

<style scoped>
.inventario-container {
  max-width: 100%;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

/* Scroll vertical */
.scroll-box {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.inventario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cantidad {
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
}
</style>
