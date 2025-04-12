<template>
  <div class="inventario-container">
    <h2 class="text-2xl font-bold text-white-800 mb-4 pb-4">📦 Inventario de Bodega</h2>

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
  const response: Response = await obtenerStockBodega()

  if (response.status === 200) {
    let res: { inventario: { nombre: string; cantidaddisponible: number }[] } =
      await response.json()
    inventario.value = res.inventario
  }
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
  max-width: 60%;
  margin: auto;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

/* Scroll vertical */
.scroll-box {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
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
