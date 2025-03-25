<template>
  <div class="container">
    <h2 class="title">Nueva Orden</h2>
    <form @submit.prevent="generarOrden" class="form">
      <input v-model="tipoDocumento" placeholder="Tipo de Documento" required class="input" />
      <input v-model="numDocumento" placeholder="Número de Documento" required class="input" />
      <button type="submit" class="button">Generar Orden</button>
    </form>

    <div v-if="orden" class="order-status">
      <p>Estado: {{ orden.estado }}</p>

      <h3>Beneficiario: {{ orden.beneficiarioid }}</h3>

      <BarComponent :value="estadoM" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BarComponent from './BarComponent.vue'

const tipoDocumento = ref('')
const numDocumento = ref('')
const orden = ref(null)

const ordenM = {
  id: 'UUID',
  beneficiarioid: 'CC3540',
  recetaid: 'string',
  estado: 'EN PREPARACION',
  fechacreacion: new Date(),
  fechaactualizacion: new Date(),
}

const estadoM = { clientid: '', orden: ordenM, porcentaje: 50 }
orden.value = ordenM

const generarOrden = () => {
  console.log('Generando orden para', tipoDocumento.value, numDocumento.value)
}
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
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input {
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
.button {
  background: hsla(160, 100%, 37%, 1);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.button:hover {
  background: hsla(160, 100%, 30%, 1);
}
.order-status {
  margin-top: 1rem;
  padding: 0.5rem;
  background: var(--color-background-mute);
  border-radius: 4px;
}
</style>
