<template>
  <v-btn class="custom-width" color="primary" variant="flat" dark data-test="buttonGeneric">
    <span class="ml">{{ buttonText }}</span>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    buttonText: String,
  
  }
})

</script>

<style>
.custom-width {
  height: 90px;
  width: 100px;
}
</style>
