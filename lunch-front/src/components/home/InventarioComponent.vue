// Inventario.vue
<template>
  <div class="container">
    <h2 class="title">Inventario</h2>
    <ul class="list">
      <li v-for="item in inventario" :key="item.id" class="list-item">
        {{ item.nombre }}: <strong>{{ item.cantidad }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
const inventario = ref([]);
</script>
