<template>
  <div>
    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="{ active: activeTab === tab }"
      >
        {{ tab }}
      </button>
    </nav>
    <div class="tab-content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NuevaOrdenComponent from './NuevaOrdenComponent.vue'

import OrdenesComponent from './OrdenesComponent.vue'
import InventarioComponent from './InventarioComponent.vue'
import ComprasComponent from './ComprasComponent.vue'
import RecetasComponent from './RecetasComponent.vue'

const tabs = ['Nueva Orden', 'Órdenes', 'Inventario', 'Compras', 'Recetas']
const activeTab = ref('Nueva Orden')

const components = {
  'Nueva Orden': NuevaOrdenComponent,
  Órdenes: OrdenesComponent,
  Inventario: InventarioComponent,
  Compras: ComprasComponent,
  Recetas: RecetasComponent,
}

const activeComponent = computed(() => components[activeTab.value])
</script>

<style scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: var(--color-background-soft);
  border-bottom: 2px solid var(--color-border);
}

.tabs button {
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text);
  transition: 0.3s;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  color: hsla(160, 100%, 37%, 1);
}

.tabs button.active {
  color: hsla(160, 100%, 37%, 1);
  border-bottom: 3px solid hsla(160, 100%, 37%, 1);
}

.tab-content {
  padding: 20px;
  background: var(--color-background);
  border-radius: 8px;
}
</style>
