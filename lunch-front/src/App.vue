import TabComponent from '@/components/home/TabComponent.vue';
<script setup lang="ts">
import TabComponent from '@/components/home/TabComponent.vue'
import Toast from '@/components/home/Toast.vue'
import { useAlertStore } from './stores/AlertStores'

const alertStore = useAlertStore()
</script>

<template>
  <div class="toast-container">
    <Toast
      :mensaje="alertStore.mensaje"
      :optMensaje="alertStore.optMensaje"
      :tipo="alertStore.tipo"
      :visible="alertStore.visible"
    />
  </div>

  <TabComponent />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.toast-container {
  max-width: 30%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
