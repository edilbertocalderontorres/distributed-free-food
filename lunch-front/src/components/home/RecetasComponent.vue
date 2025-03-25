// Recetas.vue
<template>
  <div class="container">
    <h2 class="title">Recetas</h2>
    <ul class="list">
      <li v-for="receta in recetas" :key="receta.id" class="list-item">
        <strong>{{ receta.nombre }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const recetas = ref([])
</script>
