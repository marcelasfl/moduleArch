<script setup lang="ts">
import { ClockHour4Icon, MessageCircle2Icon } from 'vue-tabler-icons';

</script>

<template>
  <VCard elevation="10" class="overflow-hidden">
    <v-card-text>
      <h3 class="text-h6 d-flex align-center">
        <ClockHour4Icon class="mr-1" size="20"/>
        22 March, 2021
      </h3>
      <h5 class="mb-4 mt-2 text-h5">
        Super awesome, Vue is coming!
      </h5>
      <v-chip class="mr-2" label size="small" color="primary"> Medium </v-chip>
      <v-chip class="mr-2" label size="small" color="error"> Low </v-chip>
      <v-divider class="mt-7"></v-divider>
      <div class="d-flex align-center mt-4">
        <v-avatar size="40">
        </v-avatar>
        <v-avatar size="40" class="ml-2">
        </v-avatar>
        <v-avatar size="40" class="ml-2">
        </v-avatar>
        <div class="ml-auto">
          <v-btn icon variant="flat">
            <v-avatar size="large" class="textSecondary">
                        <MessageCircle2Icon size="22" />
                    </v-avatar>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </VCard>
</template>