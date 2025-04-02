<template>
  <span
    class="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
    :class="[
      colorClasses
    ]"
  >
    {{ props.tag }}
  </span>
</template>



<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
    tag: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: 'ativa',
    }
})

const colorClasses = computed(() => {
  const colors = {
    ativa: 'bg-[#6FC487]/24 text-[#107B2E]',
    cancelada: 'bg-[#BD3B3B]/24 text-[#AE1212]',
    suspensa: 'bg-[#2B3A8A]/24 text-[#2B3A8A]',
    avaliacao: 'bg-[#7C85B8]/24 text-[#2B3A8A]',
    finalizada: 'bg-[#727793]/24 text-[#727793]',
    aguardando: 'bg-[#ADBC13]/24 text-[#ADBC13]',
  }

  return colors[props.color] || colors.ativa
})
</script>