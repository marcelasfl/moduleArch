import dayjs from "dayjs";
import { ref } from "vue";

export function useValidacao() {
  const form = ref();

  // Validacoes de multiplos campos
  function dateOnMonth(monthValue: number, monthItem: number) {
    if (monthValue == monthItem) {
      return true;
    }
    else return 'A data prevista para a geração da folha normal deve estar dentro do mês em questão.';
  }

  function dateOnThisAndNextMonth(currentMonth: number, targetMonth: number): boolean | string {
    const current = Number(currentMonth); // 11
    const target = Number(targetMonth);
    const nextMonth = target % 12 + 1;

    if (current === target || current === nextMonth) {
      return true;
    }
    return 'A data prevista para pagamento da folha normal deve estar dentro ou no próximo mês em questão.';
  }

  function dateOnThisAndPrevMonth(monthValue: number, monthItem: number) {
    const previousMonth = (monthItem - 1 + 12) % 12 == 0 ? 12 : (monthItem - 1 + 12) % 12;
    if (monthValue == monthItem || monthValue == previousMonth) {
        return true;
    }
    else return 'A data prevista para o fim da solicitação de bolsa deve estar dentro do mês ou anterior ao mês em questão.';
  }

  function correctOrderDate(d1: string, d2: string, message: string): boolean | string{
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1 < date2 ? true : message;
  }

  // Validacoes de desabilitar o campo
  function canEditM1(marco: string): boolean {
    const today = new Date();
    const [year, month, day] = marco.split('-').map(Number);
    const marcoDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    return today <= marcoDate;
  }

  function canEditM2(marco: string): boolean {
    const today = new Date();
    const [year, month, day] = marco.split('-').map(Number);
    const marcoDate = new Date(year, month - 1, day);
    marcoDate.setDate(marcoDate.getDate() - 1);
    marcoDate.setHours(23, 59, 59, 999);
    return today <= marcoDate;
  }

  // Validacao de diferenca minima entre marcos
  function isDifferenceLessThanThreeDays(d1: string, d2: string): boolean {
    if (!d1 || !d2) return false;
    const diff = Math.abs(dayjs(d1).diff(dayjs(d2), 'day'));
    return diff < 3;
  }

  function validaTudo() {
    form.value.validate()
    return true
  }

  return {
    form,
    dateOnMonth,
    dateOnThisAndNextMonth,
    dateOnThisAndPrevMonth,
    correctOrderDate,
    canEditM1,
    canEditM2,
    isDifferenceLessThanThreeDays,
    validaTudo
  }
}