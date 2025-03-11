<script setup lang="ts">
import { pagamentoService } from '../api/services/pagamentoService';
const { getFolha } = pagamentoService();

const folha = getFolha();
</script>

<template>
  <div>

  </div>
</template>