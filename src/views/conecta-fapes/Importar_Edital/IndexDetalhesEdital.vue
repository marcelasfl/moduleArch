<template>
    <div>
        <div class="navigate-back" @click="$router.go(-1)" data-test="buttonVoltar">
            <v-icon>mdi-chevron-left</v-icon>
            <a>Voltar</a>
        </div>
        <BaseBreadcrumb :title="page.title" />
        <div class="p-8">
            <p class="text-gray-600 mb-6"><strong>NOME DO EDITAL:</strong> {{ selectedEdital?.Nome || '' }}</p>
            <p class="text-gray-600 mb-6"><strong>ÁREA TÉCNICA:</strong> {{ selectedEdital?.AreaTecnica.Nome || '' }}</p>
            <p class="text-gray-600 mb-6"><strong>PROJETOS COMPLETOS:</strong> {{ projetosCompletos }}/{{ projetosTotais }}</p>
            <p class="text-gray-600 mb-6"><strong>ALOCAÇÕES COMPLETAS:</strong> {{ countAlocacoesCompletas }}/{{ countAlocacoesTotais }}</p>
            <div class="mb-4 d-flex align-center">
                <v-col cols="8" class="d-flex justify-start px-0">
                    <v-text-field
                        v-model="search"
                        label="Pesquise o nome do edital"
                        clearable
                        class="mr-4"
                        style="max-width: 300px;"
                        @click:clear="getPostsEditaisProjetos"
                        data-test="inputPesquisarEdital"
                    >
                    </v-text-field>
                    <v-btn
                        class="mt-1"
                        color="primary"
                        style="background-color: #2F3E9E; color: white;"
                        @click="buscarProjeto"
                        data-test="buttonBuscarProjeto"
                    >
                        Buscar
                    </v-btn>
                </v-col>
            </div>

            <v-data-table
                class="border rounded-md"
                :headers="headers"
                :items="projects"
                :items-per-page-options="[5, 10, 25]"
                v-model:page="pageTableSynced"
                v-model:items-per-page="itemsPerPageSynced"
                no-data-text="Sem dados!"
            >
                <template v-slot:item.Nome="{item}">
                    <a href="#" @click.prevent="visualizaEdital(item.Id)" data-test="linkVisualizarEdital-{{item.Id}}"><strong>{{ item.Nome }}</strong></a>
                </template>
                <template v-slot:item.StatusPreenchimento="{ item }">
                    <span v-if="item.StatusPreenchimento == 'INCOMPLETO'" class="text-error">{{ item.StatusPreenchimento }}</span>
                    <span v-else class="text-success"><strong>{{ item.StatusPreenchimento }}</strong></span>
                </template>
                <template v-slot:item.AlocacoesCompletas="{ item }">
                    <span> {{item.AlocacoesCompletas}}/{{item.AlocacaoBolsistas.length}}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon color="primary" size="small" class="mdi mdi-file-document-outline" @click="visualizaEdital(item.Id)" data-test="iconVisualizarEdital-{{item.Id}}"/>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import EditalGenericObject from '@/services/requires/objects/importaredital/Edital';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import services from '../../../services/requires/require';

const formatDate = (date: any) => {
    return dayjs(date).format('DD/MM/YYYY');
};

const page = ref({ title: 'Visualizar Edital:' });
const search = ref('');
const pageTableSynced = ref(1);
const itemsPerPageSynced = ref(10);
const projects = ref<Project[]>([]);
const router = useRouter();
const route = useRoute();
const selectedEdital = ref<Edital | null>(null);
const countAlocacoesCompletas = ref(0)
const countAlocacoesTotais = ref(0)

interface Project {
    Nome: string;
    DataInicio: string;
    DataFimPrevista: string;
    IdSigFapes: string;
    AlocacoesCompletas: string;
    StatusPreenchimento: string;
    Id: string;
}

interface Edital {
    DataCriacao: string;
    DataUltimaSincronizacao: string;
    Id: string;
    IdSigFapes: string;
    Nome: string;
    Projetos: Project[];
    [key: string]: any;
}

const headers = [
    { key: 'Nome', title: 'Projeto', align: 'start' },
    { key: 'StatusPreenchimento', title: 'Status dos dados' },
    { key: 'AlocacoesCompletas', title: 'Alocações completas' },
    { key: 'DataInicio', title: 'Última sincronização', value: (item: any) => formatDate(item.DataInicio) },
    { key: 'actions', title: 'Ações', sortable: false }
];

const editalId = route.params.id as string;

const countCompletedProjects = () => {
    return projects.value.filter((project: any) => project.StatusPreenchimento === 'COMPLETO').length;
};
const projetosCompletos = ref(0)
const countProjects = () => {
    return projects.value.length;
};
const projetosTotais = ref(0)

const getPostsEditaisProjetos = async () => {
    try {
        const EditalObject = new EditalGenericObject({ id: editalId });
        const { getById } = services(EditalObject.editalProjetos);
        const data = await getById();

        if (data.value.length) {
            countAlocacoesCompletas.value = 0
            countAlocacoesTotais.value = 0
            const edital = data.value[0];

            selectedEdital.value = edital;
            

            if (edital && edital.Projetos.length) {
                projects.value = edital.Projetos;
                page.value.title = `Visualizar Edital: ${edital.Nome}`;
                selectedEdital.value = edital;
                

                edital.Projetos.forEach((projeto: any) => {
                    countAlocacoesCompletas.value += projeto.AlocacoesCompletas
                    countAlocacoesTotais.value += projeto.AlocacaoBolsistas.length
                });
            } else {
                console.error('Nenhum projeto encontrado no edital.');
            }
            projetosTotais.value = countProjects()
            projetosCompletos.value = countCompletedProjects()

        } else {
            console.error('Resposta da API inválida ou sem dados.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do edital:', error);
    }
};

onMounted(() => {
    getPostsEditaisProjetos();
});

const goBack = () => {
    router.push('/importaredital/IndexImportarEdital');
};

const visualizaEdital = (id: string) => {
    router.push({ path: `/importaredital/FormProjeto/${id}` });
};

const buscarProjeto = async () => {
    if (search.value) {
        try {
            const EditalObject = new EditalGenericObject({ id: editalId, filter: search.value });
            const { getById } = services(EditalObject.editalProjetoFiltro);
            const data = await getById();

            const edital = data.value[0];
            projects.value = edital.Projetos;
        } catch (error) {
            console.error('Erro ao buscar dados do edital:', error);
        }
    }
};
</script>
<style scoped>
.navigate-back:hover {
    cursor: pointer;
}
</style>