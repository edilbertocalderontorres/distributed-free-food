<template>
  <div class="recetas-container">
    <h2 class="text-2xl font-bold text-white-800 mb-4">📖 Recetas Disponibles</h2>

    <!-- Scroll vertical para las tarjetas -->
    <div class="flex flex-col space-y-4 overflow-y-auto max-h-[70vh] p-2">
      <div v-for="receta in recetas" :key="receta.nombre" class="receta-card">
        <!-- Título de la receta -->
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold text-gray-900">{{ receta.nombre }}</h3>
        </div>

        <!-- Descripción -->
        <p class="text-sm text-gray-700">{{ receta.descripcion }}</p>

        <!-- Lista de ingredientes -->
        <h4 class="text-md font-semibold text-gray-800 mt-3">🛒 Ingredientes:</h4>
        <ul class="grid grid-cols-2 gap-2 mt-2">
          <li
            v-for="ing in receta.ingredientes"
            :key="ing.ingredienteid"
            class="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg shadow-sm"
          >
            <span class="text-lg">{{ obtenerIcono(ing.ingrediente) }}</span>
            <span class="text-gray-800">{{ ing.cantidad }} x {{ ing.ingrediente }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecetaAgrupada } from '@/stores/models'
import { ref, onMounted } from 'vue'
import { obtenerRecetas } from '@/services/EndpointService'

const recetas = ref<RecetaAgrupada[]>()

onMounted(async () => {

  const response: { recetas: RecetaAgrupada[] } = await obtenerRecetas()
  recetas.value = response.recetas
})

// Función para asignar iconos a los ingredientes
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
.recetas-container {
  max-width: 100%;
  padding: 1rem;
  overflow-x: hidden;
}

/* Scroll vertical */
.flex.overflow-y-auto {
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

/* Estilos de la tarjeta */
.receta-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease-in-out;
}

.receta-card:hover {
  transform: scale(1.02);
}
</style>
