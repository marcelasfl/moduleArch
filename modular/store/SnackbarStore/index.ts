import { defineStore } from 'pinia';
import { ref } from 'vue';

const snackbarStore = defineStore('snackbar', () => {
  const snackbar = ref(false);
  const snackbarText = ref('');
  const snackbarColor = ref('success');
  const snackbarTimeout = ref(3000);

  function showSnackbar(text: string, color: string = 'success', timeout: number = 3000) {
    console.log('snackbar called')

    snackbarText.value = text;
    snackbarColor.value = color;
    snackbar.value = true;
    snackbarTimeout.value = timeout;
  }

  return { snackbar, snackbarText, snackbarColor, showSnackbar, snackbarTimeout };
});

export default snackbarStore