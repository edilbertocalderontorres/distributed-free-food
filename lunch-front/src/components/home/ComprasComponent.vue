// Compras.vue
<template>
  <div class="container">
    <h2 class="title">Historial de Compras</h2>
    <ul class="list">
      <li v-for="compra in compras" :key="compra.id" class="list-item">
        {{ compra.ingrediente }} - {{ compra.cantidad }} unidades
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const compras = ref([])
</script>
