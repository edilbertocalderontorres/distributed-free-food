// Ordenes.vue
<template>
  <div class="container">
    <h2 class="title">Órdenes</h2>
    <ul class="list">
      <li v-for="orden in ordenes" :key="orden.id" class="list-item">
        {{ orden.estado }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const ordenes = ref([])
</script>

<style scoped>
.container {
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
}
.title {
  color: var(--color-heading);
  margin-bottom: 1rem;
}
.list {
  list-style: none;
  padding: 0;
}
.list-item {
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}
</style>
