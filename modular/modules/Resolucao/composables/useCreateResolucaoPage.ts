import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { resolucaoService } from '../api/services/resolucaoService';
import { useValidacao } from './useValidacaoResolucao';

const { validarNumero, validarData, validarEmenta, validarNumRastreioEdocs } = useValidacao();

export function useResolucao() {
  const router = useRouter();
  const erros = ref<string[]>([]);

  const salvarResolucao = async (form: any) => {
    const resolucao = {
      Numero: form.Numero,
      Ementa: form.Ementa,
      Link: form.Link,
      Data: form.Data,
      NumRastreioEdocs: form.NumRastreioEdocs
    };

    try {
      await resolucaoService().save(resolucao);
      console.log('Resolução salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar resolução:', error);
    }
  };

  const onSubmit = (form: any) => {
    erros.value = [];

    // const numeroErro = validarNumero(form.Numero);
    // if (numeroErro) erros.value.push(numeroErro);

    // const dataErro = validarData(form.Data);
    // if (dataErro) erros.value.push(dataErro);

    // const ementaErro = validarEmenta(form.Ementa);
    // if (ementaErro) erros.value.push(ementaErro);


    // const numRastreioErro = validarNumRastreioEdocs(form.NumRastreioEdocs);
    // if (numRastreioErro) erros.value.push(numRastreioErro);

    if (erros.value.length > 0) {
      console.log('Erros no formulário:', erros.value);
      return;
    }

    salvarResolucao(form);
  };

  const navigateBack = () => {
    router.push({ path: '/IndexResolucao' });
  };

  return {
    onSubmit,
    navigateBack,
    erros
  };
}
