<script setup lang="ts">
import { mdiUnfoldMoreHorizontal } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

defineProps({
    options: {
        type: Array as () => (string | number)[],
        required: true,
    },
    modelValue: {
        type: [String, Number] as unknown as () => string | number,
        required: true
    },
    height: {
        type: String,
        default: ''
    }
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div>
        <select 
            class="rounded w-full ring-1 ring-gray-400 px-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            :class="height"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <option v-for="option in options" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
        
        <svg-icon 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
            :size="15" 
            :path="mdiUnfoldMoreHorizontal" 
            type="mdi"
        />
    </div>
</template>