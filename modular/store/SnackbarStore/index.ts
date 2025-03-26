import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const visible = ref(false);
  const message = ref('');
  const color = ref('success');
  const timeout = ref(3000);

  function show(text: string, options?: { color?: string; timeout?: number }) {
    message.value = text;
    color.value = options?.color || 'success';
    timeout.value = options?.timeout || 3000;
    visible.value = true;
  }
  
  function hide() {
    visible.value = false;
  }

  return { 
    visible, 
    message, 
    color, 
    timeout,
    show,
    hide
  };
});