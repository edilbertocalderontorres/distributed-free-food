import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertStore = defineStore('alert', () => {
  const mensaje = ref('');
  const optMensaje = ref('');
  const tipo = ref<'success' | 'info' | 'error'>('info');
  const visible = ref(false);

  function mostrarAlert(text: string, optionalMessage: string, tipoAlert: 'success' | 'info' | 'error') {
    mensaje.value = text;
    optMensaje.value = optionalMessage;
    tipo.value = tipoAlert;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 4000); // 4 segundos visible
  }

  return { mensaje, optMensaje, tipo, visible, mostrarAlert };
});
