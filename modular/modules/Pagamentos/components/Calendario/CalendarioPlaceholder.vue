<script setup lang="ts">
const props = defineProps<{
  ano: number
}>()

const emits = defineEmits<{
  (e: 'createNewCalendar'): void
}>()
</script>

<template>
  <div class="no-calendar">
    <div>
      <v-icon size="100" color="grey">
        mdi-email-open
      </v-icon>
    </div>

    <b>Calendário indisponível</b>
    <div class="no-calendar-text">
      O calendário da folha de {{ ano }} ainda não foi criado. <br>
      Deseja criá-lo agora?
    </div>

    <v-btn
      class="custom-width-2 text-none"
      color="primary"
      variant="flat"
      dark
      @click="() => emits('createNewCalendar')"
    >
      Criar Calendário
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.no-calendar {
  font-size: 1.125rem;
  text-align: center;
  padding: 3.125rem;
}

.no-calendar-text {
  font-size: 1rem;
  text-align: center;
  padding: 0.625rem;
}
</style>