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
                                <VTextField type="number" placeholder="Ex: 123" hide-details v-model='form.Numero' required data-test="inputNumeroResolucao"></VTextField>
                                <v-label class="font-weight-small mt-1">Insira apenas o número.</v-label>
                            </v-col>

                            <v-col cols="6">
                                <v-label class="font-weight-medium mb-2">Data de publicação *</v-label>
                                <VTextField placeholder="dd/mm/aaaa" type="date" hide-details v-model='form.Data' required data-test="inputDataPublicacao"></VTextField>
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
                            v-model='form.Ementa'
                            @input="atualizaContadorEmenta"
                            required
                            data-test="textareaEmenta"
                        ></VTextarea>
                        <v-label
                            class="font-weight-small mt-1"
                            :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
                            {{ contadorCaracteresEmenta }}/500 caracteres
                        </v-label>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Link da publicação *</v-label>
                        <VTextField type="text" placeholder="https://fapes.es.gov.br/..." hide-details v-model='form.Link' required data-test="inputLinkPublicacao"></VTextField>
                        <v-label class="font-weight-small mt-1">São permitidos apenas links do próprio domínio da Fapes.</v-label>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="font-weight-medium mb-2">Número do E-Docs</v-label>
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
                    <v-col cols="6" class="d-flex justify-start">
                        <v-btn color="error" variant="contained" dark @click="dialogDelete = true" data-test="buttonExcluirResolucao">Excluir resolução</v-btn>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-end">
                        <v-btn type="submit" color="primary" flat data-test="buttonSalvarResolucao">{{ submitButtonText }}</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </form>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="headline">Confirmar Exclusão</v-card-title>
            <v-card-text>Tem certeza de que deseja excluir esta resolução?</v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="text" dark @click="dialogDelete = false" data-test="buttonCancelarExclusao">Cancelar</v-btn>
                <v-btn color="error" variant="text" dark @click="deleteItem" data-test="buttonConfirmarExclusao">Excluir</v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
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

const { post, getById, update, remove } = resolucaoService(ResolucaoObject.entity);
const route = useRoute();
const params = route.params;
const router = useRouter();
const dialogDelete = ref(false);
const form = reactive({
    Numero: '',
    Ementa: '',
    Link: '',
    Data: '',
    id: '',
    Id: '',
    NumRastreioEdocs: ''
});

const getPost = async (id: any) => {
    try {
        let response = await getById(id);
        response.value[0].Data = dayjs(response.value[0].Data).utc().format('YYYY-MM-DD');
        Object.assign(form, response.value[0]);
    } catch (error) {
        console.error(error);
    }
};

const onSubmit = async () => {
    if (Number(form.Numero) <= 0) {
        Swal.fire({
            title: "Número inválido",
            text: "O número da resolução deve ser maior que zero.",
            icon: "error",
            confirmButtonColor: "#7066E0"
        });
        return;
    }

    if (form.Ementa.length > 500) {
        Swal.fire({
            title: "Não foi possível realizar essa ação",
            text: "Ementa não pode ter mais de 500 caracteres.",
            icon: "error",
            confirmButtonColor: "#7066E0"
        });
        return;
    }

    if (!form.Link.includes("https://fapes.es.gov.br")) {
        Swal.fire({
            title: "Link inválido",
            text: "O link deve ser do domínio da FAPES.",
            icon: "error",
            confirmButtonColor: "#7066E0"
        });
        return;
    }

    try {
        if (params.id) {
            form.id = Array.isArray(params.id) ? params.id[0] : params.id;;
            await update(form);
        } else {
            await post(form);
        }
        Swal.fire({
            title: "Salvo com sucesso!",
            icon: "success",
            confirmButtonColor: "#D3D3D3",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            if (params.modalidade) {
                router.push({ path: `/modalidade/${params.modalidade}` });
            } else {
                router.push({ path: '/resolucao/IndexResolucao' });
            }
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Número da resolução incorreto",
            text: "O número da resolução já existe",
            confirmButtonColor: "#D3D3D3"
        });
    }
};

const page = ref({ title: 'Incluir nova resolução' });
const submitButtonText = ref('Incluir resolução');

onMounted(async () => {
    if (params.id) {
        await getPost(params.id);
        page.value.title = 'Alterar Resolução';
        breadcrumbs.value[1].text = page.value.title;
        submitButtonText.value = 'Alterar resolução';
    }
});

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

const deleteItem = async () => {
    
    try {
        await remove(form.Id);
        Swal.fire({
            title: "Deletado com sucesso!",
            icon: "success",
            confirmButtonColor: "#D3D3D3",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            router.push({ path: '/resolucao/IndexResolucao' });
        });
    } catch (error) {
        console.error('Error occurred while deleting item:', error);
        Swal.fire('Não foi possível apagar, pois a resolução está vinculada a um projeto');
    } finally {
        dialogDelete.value = false;
    }
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
