<template>
  <div :class="alertClasses" role="alert" v-if="visible">
    <div class="flex">
      <div class="py-1">
        <svg :class="textColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
          />
        </svg>
      </div>
      <div>
        <p class="text-sm">{{ optMensaje }}</p>

        <p class="font-bold">{{ mensaje }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  mensaje: string
  optMensaje: string
  tipo: 'success' | 'info' | 'error' | 'warning'
  visible: boolean
}>()

const alertConfig = {
  success: {
    bg: 'bg-teal-100',
    border: 'border-t-4 border-teal-500',
    text: 'text-teal-900',
    textColor: 'text-teal-500',
    title: 'Éxito',
  },
  warning: {
    bg: 'bg-orange-100',
    border: 'border-l-4 border-orange-500',
    text: 'text-orange-700',
    textColor: 'text-orange-500',
    title: 'Advertencia',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border border-red-400',
    text: 'text-red-700',
    textColor: 'text-red-500',
    title: 'Error',
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-t-4 border-blue-500',
    text: 'text-blue-900',
    textColor: 'text-blue-500',
    title: 'Información',
  },
}

// Clases computadas
const alertType = computed(() => props.tipo)

const alertClasses = computed(() => {
  const config = alertConfig[alertType.value as keyof typeof alertConfig]
  return [config.bg, config.border, config.text, 'px-4 py-3 rounded relative']
})

const textColor = computed(() => alertConfig[alertType.value].textColor)
</script>

<style scoped>
/* Estilos para el contenedor principal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
