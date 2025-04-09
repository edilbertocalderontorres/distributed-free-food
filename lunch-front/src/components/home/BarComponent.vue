<script setup>

const props = defineProps({
  porcentaje: Number,
})
</script>

<template>
  <div
    class="progress-container flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
    role="progressbar"
    aria-valuenow="{{props.porcentaje}}"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="progress-bar flex flex-col justify-center rounded-full overflow-hidden bg-teal-600 text-xs text-white text-center whitespace-nowrap dark:bg-teal-600 transition duration-500"
      :style="{ width: props.porcentaje + '%' }"
    >
      {{ `${props.porcentaje}%` }}
    </div>
  </div>
</template>
<style scoped>
.progress-container {
  margin-top: 3rem;
}

.progress-bar {
  transition: width 0.5s ease-in-out;
}
</style>
