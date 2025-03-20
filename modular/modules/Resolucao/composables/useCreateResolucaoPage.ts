import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ResolucaoService } from '../api/services/ResolucaoService';


export function useResolucao() {
    const router = useRouter();
    const erros = ref<string[]>([]);
    const queryClient = useQueryClient();
    const resolucaoService = inject('resolucaoService') as ResolucaoService;

    const { mutateAsync: save, isPending, isError, isSuccess } = useMutation({
        mutationFn: async (form: any) => {
            const resolucao = {
                Numero: form.Numero,
                Ementa: form.Ementa,
                Link: form.Link,
                Data: form.Data,
                NumRastreioEdocs: form.NumRastreioEdocs
            };
            return await resolucaoService.save(resolucao);
        },
        onSuccess: () => {
            console.log('Resolução salva com sucesso');
            queryClient.invalidateQueries({ queryKey: ['resolucoes'] });
            router.push('/IndexResolucao');
        },
        onError: (error) => {
            console.error('Erro ao salvar resolução:', error);
        }
    });

    const onSubmit = (form: any) => {
        erros.value = [];
        if (erros.value.length > 0) {
            return;
        }

        save(form);
    };

    const navigateBack = () => router.push('/IndexResolucao');

    return {
        onSubmit,
        navigateBack,
        isPending,
        isError,
        isSuccess,
        erros,
        save
    };
}
