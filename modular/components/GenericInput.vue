<script lang="ts" setup>
import { mdiCloseCircle } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

</script>

<template>
    <div>
    <input
        class="rounded w-full ring-1 ring-gray-400 px-2 ml-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
        :class="height"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        type="text"
        :placeholder="placeholder"
    />
    <svg-icon 
        class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500" 
        :size='25' 
        :path="mdiCloseCircle" 
        type="mdi" 
        v-if="modelValue"  
        @click="$emit('update:modelValue', '')"
    ></svg-icon>
    </div>
</template>