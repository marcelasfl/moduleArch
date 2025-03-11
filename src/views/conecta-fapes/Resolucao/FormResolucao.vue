<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <form @submit.prevent="onSubmit">
        <v-card elevation="10" class="" rounded="md">
            <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="6">
                                <v-label class="font-weight-medium mb-2">Número da resolução *</v-label>
                                <VTextField
                                    type="number"
                                    placeholder="Ex: 123"
                                    hide-details
                                    v-model="form.Numero"
                                    @keypress="$event.key.match(/^[\d\.]$/) ? '' : $event.preventDefault()"
                                    data-test="inputNumeroResolucao"
                                ></VTextField>
                                <v-label class="font-weight-small mt-1">Insira apenas o número.</v-label>
                            </v-col>

                            <v-col cols="6">
                                <v-label class="font-weight-medium mb-2">Data de publicação *</v-label>
                                <VTextField
                                    placeholder="dd/mm/aaaa"
                                    type="date"
                                    hide-details
                                    v-model="form.Data"
                                    required
                                    data-test="inputDataPublicacao"
                                ></VTextField>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Ementa *</v-label>
                        <VTextarea
                            auto-grow
                            placeholder="Escreva os objetivos da resolução em até 500 caracteres"
                            rows="2"
                            color="primary"
                            row-height="25"
                            shaped
                            hide-details
                            v-model="form.Ementa"
                            @input="atualizaContadorEmenta"
                            required
                            data-test="textareaEmenta"
                        ></VTextarea>
                        <v-label class="font-weight-small mt-1" :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
                            {{ contadorCaracteresEmenta }}/500 caracteres
                        </v-label>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Link da publicação *</v-label>
                        <VTextField
                            type="text"
                            placeholder="https://fapes.es.gov.br/..."
                            hide-details
                            v-model="form.Link"
                            required
                            data-test="inputLinkPublicacao"
                        ></VTextField>
                        <v-label class="font-weight-small mt-1">São permitidos apenas links do próprio domínio da Fapes.</v-label>
                    </v-col>

                    <v-col cols="6">
                        <v-label class="font-weight-medium mb-2">Número do E-Docs *</v-label>
                        <VTextField
                            type="text"
                            placeholder="EX: WTC-10192"
                            hide-details
                            v-model="form.NumRastreioEdocs"
                            required
                            data-test="inputNumeroEDocs"
                        ></VTextField>
                        <v-label class="font-weight-small mt-1">Registre o número do E-Docs da Resolução.</v-label>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                        <v-btn type="button" color="primary" variant="outlined" class="mr-3" @click="navigateBack" data-test="buttonVoltar">Voltar</v-btn>
                        <v-btn type="submit" color="primary" flat data-test="buttonSalvar">{{ submitButtonText }}</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </form>
</template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ResolucaoGenericObject from '@/services/requires/objects/modalidadebolsa/Resolucao';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import resolucaoService from '../../../services/requires/require';
const ResolucaoObject = new ResolucaoGenericObject({});

const { post, getById, update } = resolucaoService(ResolucaoObject.entity);
const route = useRoute();
const params = route.params;
const router = useRouter();
const form = reactive({
    Numero: null as number | null,
    Ementa: '',
    Link: '',
    Data: '',
    id: '',
    NumRastreioEdocs: ''
});

const getPost = async (id: string) => {
    try {
        let response = await getById(id);
        response.value[0].Data = dayjs(response.value[0].Data).utc().format('YYYY-MM-DD');
        Object.assign(form, response.value[0]);
    } catch (error) {
        console.error(error);
    }
};

const onSubmit = async () => {
    if (form.Numero == null || form.Numero <= 0) {
        Swal.fire({
            title: 'Número inválido',
            text: 'O número da resolução deve ser maior que zero.',
            icon: 'error',
            confirmButtonColor: '#7066E0'
        });
        return;
    }

    if (form.Ementa.length > 500) {
        Swal.fire({
            title: 'Ementa inválida!',
            text: 'Ementa não pode ter mais de 500 caracteres.',
            icon: 'error',
            confirmButtonColor: '#7066E0'
        });
        return;
    }

    if (!form.Link.includes('https://fapes.es.gov.br')) {
        Swal.fire({
            title: 'Link inválido!',
            text: 'O link deve ser do domínio da FAPES.',
            icon: 'error',
            confirmButtonColor: '#7066E0'
        });
        return;
    }

    if (form.Numero > 2147483647) {
        Swal.fire({
            title: 'Número inválido!',
            text: 'O número da resolução ultrapassa o valor máximo permitido!',
            icon: 'error',
            confirmButtonColor: '#7066E0'
        });
        return;
    }

    try {
        const resolucaoId = ref('');
        if (params.id) {
            form.id = verificaArrayParams();
            await update(form);
        } else {
            const resolucao = await post(form);
            resolucaoId.value = resolucao.uri.replace('api/modalidadebolsa/resolucao/', '');
        }
        Swal.fire({
            title: 'Salvo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#D3D3D3',
            timer: 700,
            showConfirmButton: false
        }).then(() => {
            if (params.modalidade) {
                router.push({ path: `/modalidade/${params.modalidade}${resolucaoId.value}` });
            } else {
                router.push({ path: '/resolucao/IndexResolucao' });
            }
        });
    } catch (error: any) {
        console.error(error);
        erroSubmit(error);
    }
};

const erroSubmit = (error: any) => {
    console.error(error);
    if (error.response && error.response.data.errors) {
        Swal.fire({
            title: 'Erro ao salvar!',
            icon: 'error',
            text: error.response.data.errors[0].mensagem,
            confirmButtonColor: '#D3D3D3'
        });
        return;
    }
    Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: 'Ocorreu um erro não identificado!', confirmButtonColor: '#D3D3D3' });
};

const verificaArrayParams = () => {
    if (typeof params.id === 'string') {
        return params.id;
    } else if (Array.isArray(params.id)) {
        return params.id[0];
    }
    return '';
};

const page = ref({ title: 'Incluir Nova Resolução' });
const submitButtonText = ref('Incluir resolução');

onMounted(async () => {
    if (params.id) {
        await getPost(verificaSeEhLista());
        page.value.title = 'Alterar Resolução';
        breadcrumbs.value[1].text = page.value.title;
        submitButtonText.value = 'Alterar resolução';
    }
    atualizaContadorEmenta();
});

const verificaSeEhLista = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    }
    return params.id;
};

const breadcrumbs = ref([
    {
        text: 'Resolução',
        disabled: false,
        href: '/resolucao/IndexResolucao'
    },
    {
        text: page.value.title,
        disabled: true,
        href: '#'
    }
]);

const navigateBack = () => {
    router.push({ path: '/resolucao/IndexResolucao' });
};

const contadorCaracteresEmenta = ref(0);

const atualizaContadorEmenta = () => {
    contadorCaracteresEmenta.value = form.Ementa.length;
};
</script>

<style scoped>
.text-danger {
    color: red;
}
</style>
