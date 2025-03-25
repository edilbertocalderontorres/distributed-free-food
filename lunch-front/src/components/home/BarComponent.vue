<template>
  <div
    class="progress-container"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress-bar" :style="{ width: (evento?.porcentaje || 0) + '%' }">
      {{ evento?.porcentaje || 0 }}%
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  evento: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  height: 16px;
  background: var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 3rem;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 8px;
  background: hsla(160, 100%, 37%, 1);
  color: var(--vt-c-white);
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  transition: width 0.5s ease-in-out;
}
</style>
