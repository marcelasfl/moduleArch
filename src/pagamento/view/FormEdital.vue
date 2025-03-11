<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    <v-form @submit.prevent="putEditais(verificaSeEhLista())" class="form">
        <v-row>
            <v-col cols="6">
                <p class="mb-2"><b>Nome do Edital</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-text-field v-if="!isLoading" type="text" placeholder="Insira aqui o nome do edital" clearable required v-model="form.Nome" data-test="inputTextNomeEdital"></v-text-field>
            </v-col>
            <v-col cols="6">
                <p class="mb-2"><b>Data de Publicação</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-text-field
                    v-if="!isLoading"
                    placeholder="dd/mm/aaaa"
                    type="date"
                    hide-details
                    clearable
                    v-model="formattedDate"
                    required
                    data-test="inputDatetimeDataPublicacao"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <p class="mb-2"><b>Status</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-select
                v-if="!isLoading"
                placeholder="Selecione o status do Edital"
                :items="enumStatus"
                item-title="Nome"
                item-value="value"
                v-model="form.Status"
                clearable
                required
                data-test="selectStatusEdital"
                ></v-select>
            </v-col>
            <v-col cols="6">
                <p class="mb-2"><b>Área Técnica</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-select
                v-if="!isLoading"
                placeholder="Selecione a área técnica"
                :items="areaTecSelect"
                item-title="Nome"
                item-value="Id"
                v-model="form.AreaTecnicaId"
                clearable
                required
                data-test="selectAreaTecnica"
                ></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <p class="mb-2"><b>Inscrição Genérica</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-text-field
                type="text"
                v-if="!isLoading"
                placeholder="Ex: ED240000006"
                v-model="form.InscricaoGenerica"
                clearable
                required
                data-test="inputTextInscricaoGenerica"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <p class="mb-2"><b>Processo/Encaminhamento</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-text-field
                type="text"
                v-if="!isLoading"
                placeholder="Ex: 2024-4NWGJ"
                v-model="form.Processo"
                clearable
                required
                data-test="inputTextProcessoEncaminhamento"
                ></v-text-field>
            </v-col>
            <v-col  >
                <p class="mb-2"><b>Atividade</b></p>
                <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
                <v-select
                v-if="!isLoading"
                placeholder="Selecione a atividade"
                :items="atividadeSelect"
                item-title="Nome"
                item-value="Id"
                v-model="form.AtividadeId"
                clearable
                required
                data-test="selectAtividade"
                ></v-select>
            </v-col>
        </v-row>
        <v-row justify="end">
        <v-col cols="auto">
            <v-btn style="color:black" text @click="navigateBack()">Cancelar</v-btn>
            <v-btn class="custom-width-2 text-none" type="submit" color="primary" variant="flat" dark>
                {{ submitButtonText }}
            </v-btn>
        </v-col>
    </v-row>
    </v-form>
</template>
<script setup lang="ts">

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import router from '@/router';
import dayjs from 'dayjs';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAreaTecnicaStore } from '../controller/store/AreaTecnicaStore';
import AreaTecnicaRoutes from '../model/repositories/apiRoutes/AreaTecnica';
import Swal from 'sweetalert2';

const route = useRoute();
const params = route.params;
const page = ref({title: 'Incluir Novo Edital' });
const submitButtonText = ref('Incluir Edital');

const breadcrumbs = ref([
    {
        text: 'Editais',
        disabled: false,
        href: '/pagamento/VisualizarEditais'
    },
    {
        text: page.value.title,
        disabled: true,
        href: '#'
    }
]);

const formattedDate = computed({
  get() {
    if (!form.DataCriacao) return "";
    return dayjs(form.DataCriacao).format("YYYY-MM-DD"); // Ajustado para input date
  },
  set(value: any) {
    updateOriginalDate(value);
  },
});

const updateOriginalDate = (value: any) => {
  if (!value) {
    form.DataCriacao = "";
    return;
  }
  form.DataCriacao = dayjs(value, "YYYY-MM-DD").format("YYYY-MM-DDT00:00:00[Z]");
};


const form = reactive({
    Nome: '',
    Status: '' || null,
    DataCriacao: '',
    AreaTecnicaId: '' || null,
    Id: '',
    InscricaoGenerica: '',
    Processo: '',
    StatusImportacao: '',
    IdSigFapes: 1,
    AtividadeId: '' || null
});

const enumStatus = ref([
  { value: 0, Nome: "ATIVO"},
  { value: 1, Nome: "INATIVO"}
]);

const navigateBack = () => {
    router.go(-1);
};

const verificaSeEhLista = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    }
    return params.id;
};

const editalInfo = ref();
import { useEditalStore } from '../controller/store/EditalStore';
import AtividadeRoutes from '../model/repositories/apiRoutes/Atividade';
import { useAtividadeStore } from '../controller/store/AtividadeStore';
async function getEditais() {
    await useEditalStore.fetchById(verificaSeEhLista());
    editalInfo.value = useEditalStore.items
    editalInfo.value.Status = statusTratado(editalInfo.value.Status);
    form.DataCriacao = editalInfo.value.DataCriacao ? dayjs(editalInfo.value.DataCriacao).format("YYYY-MM-DD") : "";
    if (editalInfo.value.AreaTecnica){
        form.AreaTecnicaId = editalInfo.value.AreaTecnica.Id;
    } else {
        form.AreaTecnicaId = null;
    }
    if (editalInfo.value.Atividade){
        form.AtividadeId = editalInfo.value.Atividade.Id;
    } else {
        form.AtividadeId = null;
    }
    Object.assign(form, editalInfo.value);
    delete form["AreaTecnica"];
    delete form["Atividade"]
}

async function putEditais(id: string){
    await useEditalStore.updateItem(id, form);
    Swal.fire({
            title: 'Salvo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#D3D3D3',
            timer: 700,
            showConfirmButton: false
    }).then(() => {
        router.push({ path: '/pagamento/VisualizarEditais' });
    });
}


const statusTratado = (stt: string) => {
  if (stt == "ATIVO"){
    return 0;
  } else {
    return 1;
  }
}

const areaTecSelect = ref();
const AreaTecnicaRoutesObject = new AreaTecnicaRoutes({expand:'*'});
async function getAreaTecnicas() {
    await useAreaTecnicaStore.filter(AreaTecnicaRoutesObject.expand);
    areaTecSelect.value = useAreaTecnicaStore.items;
}

const atividadeSelect = ref();
const AtividadeRoutesObject = new AtividadeRoutes({expand:'*'});
async function getAtividades(){
    await useAtividadeStore.fetch(AtividadeRoutesObject.expand);
    atividadeSelect.value = useAtividadeStore.items;
}

const isLoading = ref(false);

onMounted(async () => {
    isLoading.value = true;
    if (params.id) {
        page.value.title = 'Alterar Edital';
        breadcrumbs.value[1].text = page.value.title;
        submitButtonText.value = 'Alterar Edital';
        await getEditais();
    };
    await getAreaTecnicas();
    await getAtividades();
    isLoading.value = false;
});

</script>
<style scoped>
.form{
    padding: 15px;
    border-radius: 15px;
    border: 1px solid rgb(228, 228, 228)
}
</style>