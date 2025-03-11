// ===============================|| Blank Layout ||=============================== //
<script async setup lang="ts">
import config from '@/config';
import { RouterView } from "vue-router";

</script>
<template>
  <v-locale-provider v-if="!config.setRTLLayout">
    <v-app :theme="config.actTheme">
      <RouterView />
    </v-app>
  </v-locale-provider>
</template>

