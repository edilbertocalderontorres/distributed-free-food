<script setup lang="ts">
import { ref } from 'vue'
import BarComponent from '@/components/home/BarComponent.vue'
import type { EventoEstado, Orden } from '@/stores/models'
import type { WsEventMessage } from '@/stores/models'
import { crearOrden } from '@/services/EndpointService'

const tipoDocumento = ref('')
const numDocumento = ref('')
const orden = ref<Orden>()
const porcentaje = ref<number>(0)
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/'
const userid = 'webapp'

const mensaje = ref('')
const error = ref(false)
const loading = ref(false)
let socket = new WebSocket(`${WS_URL}${userid}`)

function manejarMensaje(mensaje: EventoEstado): void {
  porcentaje.value = mensaje.porcentaje
  orden.value = mensaje.orden
}

socket.onopen = () => {
  console.log('WebSocket conectado a:', WS_URL)
}

socket.onmessage = (event) => {
  try {
    const mensaje: EventoEstado = JSON.parse(event.data)

    manejarMensaje(mensaje)
  } catch (error) {
    console.error('Error procesando mensaje WS:', error)
  }
}

socket.onerror = (error) => {
  console.error('WebSocket Error:', error)
}

socket.onclose = () => {
  console.warn('WebSocket desconectado. Intentando reconectar en 5s...')
  setTimeout(() => {
    reconnect()
  }, 5000)
}

function reconnect() {
  console.log('Intentando reconectar...')
  socket = new WebSocket(`${WS_URL}${userid}`)
}

async function enviarOrden() {
  if (!tipoDocumento.value || !numDocumento.value) {
    mensaje.value = 'Todos los campos son obligatorios'
    error.value = true
    return
  }
  mensaje.value = ''
  error.value = false
  loading.value = true

  try {
    const response = await crearOrden(tipoDocumento.value, numDocumento.value)
    mensaje.value = response.mensaje
  } catch (err) {
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="container">
    <h2 class="title">Nueva Orden</h2>

    <!-- Formulario de Nueva Orden -->
    <form @submit.prevent="enviarOrden" class="form">
      <select  v-model="tipoDocumento" placeholder="Tipo de Documento" required class="input" >
        <option value="">Tipo de Documento</option>
        <option value="CC">Cédula de Ciudadanía</option>
        <option value="CE">Cédula de Extranjería</option>
        <option value="TI">Tarjeta de Identidad</option>
        <option value="RC">Registro Civil</option>
      </select>
      <input v-model="numDocumento" placeholder="Número de Documento" required class="input" />
      <button type="submit" :disabled="loading" class="button">Generar Orden</button>
    </form>

    <!-- Estado de la Orden -->
    <div v-if="orden" class="order-status">
      <h2 class="estado">
        📌 Estado: <span>{{ orden.estado }}</span>
      </h2>
      <h2 class="beneficiario">
        👤 Beneficiario: <span>{{ orden.beneficiarioid }}</span>
      </h2>

      <h2 class="beneficiario">
        Plato: <span>{{ orden.recetanombre }}</span>
      </h2>

      <!-- Barra de Progreso -->
      <BarComponent :porcentaje="porcentaje" />
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.container {
  max-width: 400px;
  margin: auto;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  text-align: center;
}

/* Título */
.title {
  color: var(--color-heading);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Formulario */
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Campos de entrada */
.input {
  padding: 10px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  color: rgb(45, 45, 45);
  background: white;
  transition: border 0.3s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 0 5px hsla(160, 100%, 37%, 0.5);
}

/* Botón */
.button {
  background: hsla(160, 100%, 37%, 1);
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s ease-in-out;
}

.button:hover {
  background: hsla(160, 100%, 30%, 1);
  transform: scale(1.03);
}

.button:disabled {
  background: gray;
  cursor: not-allowed;
}

/* Sección de Estado de la Orden */
.order-status {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--color-background-mute);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Estado y Beneficiario */
.estado,
.beneficiario {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-heading);
}

.estado span,
.beneficiario span {
  font-weight: normal;
  color: var(--color-text);
}
</style>
