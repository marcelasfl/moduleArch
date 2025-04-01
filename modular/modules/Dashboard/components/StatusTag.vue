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
import { computed, defineProps } from 'vue'
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
    ativa: 'bg-[#6FC487]/12 text-[#6FC487]',
    cancelada: 'bg-[#BD3B3B]/12 text-[#BD3B3B]',
    suspensa: 'bg-[#2B3A8A]/12 text-[#2B3A8A]',
    avaliacao: 'bg-[#7C85B8]/12 text-[#7C85B8]',
    finalizada: 'bg-[#727793]/12 text-[#727793]',
    aguardando: 'bg-[#ADBC13]/12 text-[#ADBC13]',
  }

  return colors[props.color] || colors.ativa
})
</script>