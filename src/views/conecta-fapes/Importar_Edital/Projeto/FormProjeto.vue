<template>
    <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
        <v-row>
            <v-col cols="3">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-skeleton-loader type="button" class="skeleton-loader" />
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader type="button" class="skeleton-loader" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="table" class="skeleton-loader" />
            </v-col>
        </v-row>
    </v-skeleton-loader>

    <div class="mb-4 d-flex align-items-center">
        <div class="navigate-back" @click="$router.go(-1)">
            <v-icon>mdi-chevron-left</v-icon>
            <a>Voltar</a>
        </div>
    </div>

    <div class="p-8">
        <h2>{{ page.title }}</h2>
        <div class="mb-6">
            Atualize e complete os dados das alocações dos projetos contemplados <br> 
            pelo projeto {{ page.project }} para concluir a sincronização.
        </div>
    </div>

    <div v-if="isLoading">
        <v-skeleton-loader type="text@3"></v-skeleton-loader>
    </div>

    <div v-else>
        <v-row>
            <v-col cols="4">
                <v-text-field
                    label="Pesquisar o nome do bolsista"
                    v-model="search"
                    clearable
                    @click:clear="searchPessoa"
                ></v-text-field>
            </v-col>

            <v-col cols="4">
                <v-select
                    :items="StatusAlocacaoItems"
                    item-title="Status"
                    item-value="Value"
                    label="Filtrar por status da alocação"
                    hide-details
                    v-model="searchStatus"
                    clearable
                    @click:clear="searchPessoa"
                ></v-select>
            </v-col>

            <v-col cols="1" class="mt-1">
                <v-btn class="custom-width" color="primary" variant="flat" dark @click="searchPessoa">Buscar</v-btn>
            </v-col>
        </v-row>
    </div>

    <v-data-table
        class="border rounded-md"
        :headers="headers"
        :items="items"
    >
        <template v-slot:item.QtdeCotas="{ item }">
            <div class="d-flex align-items-center">
                <input
                    v-model="item.QtdeCotasPagas"
                    type="number"
                    min="0"
                    :max="item.QtdeCotas"
                    dense
                    hide-details
                    :class="{
                        'small-input': true,
                        'input-error': item.QtdeCotasPagas === '' || item.QtdeCotasPagas > item.QtdeCotas
                    }"
                    @blur="submitCotas(item)"
                ></input>
                <span>/{{ item.QtdeCotas }}</span>
                <v-tooltip v-if="item.QtdeCotasPagas === ''" text="Este campo não pode ser salvo como vazio novamente.">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="error" size="small" class="ms-2">mdi-close</v-icon>
                    </template>
                </v-tooltip>
                <v-tooltip v-if="item.QtdeCotasPagas > item.QtdeCotas" text="A quantidade de cotas pagas não pode exceder a quantidade de contas totais!">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="error" size="small" class="ms-2">mdi-close</v-icon>
                    </template>
                </v-tooltip>
                <v-tooltip v-if="item.QtdeCotasPagas === null" text="Este campo está pendente.">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="warning" size="small" class="ms-2">mdi-alert-outline</v-icon>
                    </template>
                </v-tooltip>
                <v-icon v-if="item.QtdeCotasPagas !== null && item.QtdeCotasPagas !== '' && item.QtdeCotasPagas !== undefined && item.QtdeCotasPagas <= item.QtdeCotas" 
                color="success" size="small" class="ms-2">mdi-check</v-icon>
            </div>
        </template>

        <template v-slot:item.Status="{ item }">
            {{ transformAlocacaoStatus(item.Status) }}
        </template>

        <template v-slot:item.DataFimAtividade="{ item }">
                <span v-if="item.Status != 'CANCELADA'">-</span>
                <div v-else class="d-flex align-items-center">
                    <input
                        v-if="item.DataFimAtividade != null"
                        placeholder="dd/mm/aaaa"
                        type="date"
                        hide-details
                        required
                        v-model="item.DataFimAtividade.split('T')[0]"
                        disabled
                    ></input>
                    <input
                        v-else
                        placeholder="dd/mm/aaaa"
                        type="date"
                        hide-details
                        required
                        disabled
                    ></input>
                    <v-icon v-if="item.DataFimAtividade" color="success" size="small" class="ms-2">mdi-check</v-icon>
                    <v-tooltip v-else text="Este campo é opcional porque esta alocação já veio cancelada.">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" color="primary" size="small" class="ms-2">mdi-information</v-icon>
                        </template>
                    </v-tooltip>
                </div>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-dialog v-if="item.Status == 'ATIVA'" v-model="dialogCancel" max-width="650px">
                <template v-slot:activator>
                    <v-icon  color="error" size="small" class="me-2" @click="cancelAlocacao(item)">mdi-cancel</v-icon>
                </template>
                <v-card>
                    <form @submit.prevent="submitCancelarAlocacao">
                        <v-card-title class="pt-4 d-flex align-items-center">
                            <v-icon color="error" class="mr-2">mdi-close</v-icon>
                            <span class="text-h5 pt-1">Cancelar alocação do projeto</span>
                        </v-card-title>
                        <v-card-text>
                            <v-label>
                                Para cancelar um bolsista do projeto, é necessário dizer a data de fim das <br>
                                atividades e uma justificativa para o cancelamento.
                            </v-label>
                            <div class="mt-4 mb-2 text-base"> 
                                Data de fim das atividades *
                            </div>
                            <VTextField
                                placeholder="dd/mm/aaaa"
                                type="date"
                                hide-details
                                required
                                name="data_fim_atividade"
                                v-model="formattedDataFimAtividade"
                            ></VTextField>
                            <div v-if="formCancel.DataFimAtividade != null">
                                <span v-if="workedEnoughDays(formCancel.DataFimAtividade)" class="warningDialogCancel">
                                    A data selecionada atende ao requisito de pagamento e o bolsista <b> terá </b> direito à
                                    bolsa desta competência.
                                </span>
                                <span v-else class="warningDialogCancel text-base">
                                    A data selecionada <b> não atende </b> ao requisito de pagamento e o bolsista <b> não terá </b>
                                    direito à bolsa desta competência.
                                </span>
                            </div>
                            <div class="mt-4 mb-2 text-base"> 
                                Justificativa do cancelamento *
                            </div>
                            <VTextarea
                                auto-grow
                                placeholder="Digite aqui a justificativa"
                                rows="2"
                                row-height="25"
                                shaped
                                hide-details
                                required
                                name="justificativa"
                                v-model="formCancel.JustificativaCancelamento"
                            ></VTextarea>
                            <div class="mt-4 mb-2 text-base"> 
                                Deseja cancelar a alocação de <b>{{ formCancel.Nome }}</b>?
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="tonal" dark @click="closeDialogCancel"> Fechar </v-btn>
                            <v-btn color="error" variant="flat" dark type="submit"> Cancelar alocação </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
            <v-dialog v-if="item.Status == 'CANCELADA' && item.JustificativaCancelamento != '' && item.DataFimAtividade != null" v-model="dialogEditCancelAlocacao" max-width="650px">
                <template v-slot:activator>
                    <v-icon color="primary" size="small" class="me-2" @click="editEditCancelAlocacao(item)">mdi-eye</v-icon>
                </template>
                <v-card>
                    <form @submit.prevent="submitCancelarAlocacao">
                        <v-card-title class="pt-4 d-flex align-items-center">
                            <span class="text-h5 pt-1 pl-2">Ver detalhes de cancelamento</span>
                        </v-card-title>
                        <v-card-text>
                            <span class="text-base">
                                Bolsita <br>
                                <b>{{ formCancel.Nome }}</b>
                            </span>
                            <div class="mt-4 mb-2 text-base"> 
                                Data de fim das atividades *
                            </div>
                            <VTextField
                                placeholder="dd/mm/aaaa"
                                type="date"
                                hide-details
                                required
                                name="data_fim_atividade"
                                v-model="formattedDataFimAtividade"
                            ></VTextField>
                            <div class="mt-4 mb-2 text-base"> 
                                Justificativa do cancelamento *
                            </div>
                            <VTextarea
                                auto-grow
                                placeholder="Digite aqui a justificativa"
                                rows="2"
                                row-height="25"
                                shaped
                                hide-details
                                required
                                name="justificativa"
                                v-model="formCancel.JustificativaCancelamento"
                            ></VTextarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="tonal" dark @click="closeDialogEditCancelAlocacao"> Fechar </v-btn>
                            <v-btn color="primary" variant="flat" dark type="submit"> Salvar </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
            <v-dialog v-if="item.Status == 'CANCELADA' && item.JustificativaCancelamento == null && item.DataFimAtividade == null" v-model="dialogEditCancelAlocacaoSemJustificativa" max-width="650px">
                <template v-slot:activator>
                    <v-icon color="primary" size="small" class="me-2" @click="editEditCancelAlocacaoSemJustificativa(item)">mdi-eye</v-icon>
                </template>
                <v-card>
                    <form @submit.prevent="submitCancelarAlocacao">
                        <v-card-title class="pt-4 d-flex align-items-center">
                            <span class="text-h5 pt-1 pl-2">Ver detalhes de cancelamento</span>
                        </v-card-title>
                        <v-card-text>
                            <span class="text-base">
                                Bolsita <br>
                                <b>{{ formCancel.Nome }}</b>
                            </span>
                            <div class="mt-4 mb-2 text-base"> 
                                Data de fim das atividades
                            </div>
                            <VTextField
                                v-model="formattedDataFimAtividade"
                                placeholder="dd/mm/aaaa"
                                type="date"
                                name="data_fim_atividade"
                                hide-details
                            ></VTextField>
                            <div class="mt-4 mb-2 text-base"> 
                                Justificativa do cancelamento
                            </div>
                            <VTextarea
                                v-model="formCancel.JustificativaCancelamento"
                                auto-grow
                                placeholder="Digite aqui a justificativa"
                                rows="2"
                                row-height="25"
                                shaped
                                name="justificativa"
                                hide-details
                            ></VTextarea>
                            <span class="">
                                <b>Os campos acima são opcionais</b> porque esta alocação já veio cancelada.
                            </span>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="tonal" dark @click="closeDialogEditCancelAlocacaoSemJustificativa"> Fechar </v-btn>
                            <v-btn color="primary" variant="flat" dark type="submit"> Salvar </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
        </template>
        
        <template v-slot:no-data>
            <v-skeleton-loader v-if="isLoading" type="table"></v-skeleton-loader>
            <v-label v-else>Sem dados!</v-label>
        </template>
    </v-data-table>
</template>

<script async setup lang="ts">
// Importacoes
import AlocacaoBolsistaGenericObject from '@/services/requires/objects/importaredital/AlocacaoBolsista';
import ProjetoGenericObject from '@/services/requires/objects/importaredital/Projeto';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VTextarea } from 'vuetify/lib/components/index.mjs';
import services from '../../../../services/requires/require';

// Rotas
const router = useRouter();
const route = useRoute();
const params = route.params;
const isLoading = ref(true);
const search = ref()
const searchStatus = ref()

const page = ref({ project: '', title: ''})

const headers = [
    { key: 'Pessoa.Nome', title: 'Nome do bolsista', sortable: false },
    { key: 'Status', title: 'Status Alocação', sortable: false },
    { key: 'QtdeCotas', title: 'Cotas pagas/totais', sortable: false },
    { key: 'DataFimAtividade', title: 'Fim das atividades', sortable: false },
    { key: 'actions', title: 'Ações', sortable: false }
];
const items = ref([]);
setTimeout(() => {
  isLoading.value = false; 
}, 500);

const StatusAlocacaoItems = ref ([
    { Status: "Ativa", Value: 'ATIVA' },
    { Status: "Cancelada", Value: 'CANCELADA' },
    { Status: "Em avaliação", Value: 'EM_AVALIACAO' }
]);

function transformAlocacaoStatus(status: string) {
    if (status == 'ATIVA') {
        return 'Ativa'
    } else if (status == 'CANCELADA') {
        return 'Cancelada'
    } else if (status == 'EM_AVALIACAO') {
        return 'Em avaliação'
    } else if (status == 'SUSPENSA') {
        return 'Suspensa'
    } else if (status == 'FINALIZADA') {
        return 'Finalizada'
    }
    return ''
};

// Forms
const formCancel = reactive({
    DataFimAtividade: '',
    JustificativaCancelamento: '',
    Nome: '', 
    Id: '',
    id: ''
});

const formAlocacao = reactive({
    Id: '',
    id: '',
    CotasPagas: ''
});

// Interfaces
interface ItemCancelInterface {
    DataFimAtividade: string;
    JustificativaCancelamento: string;
    Pessoa: PessoaInterface;
    Id: string;
    id: string;
}

interface PessoaInterface {
    Nome: string;
}

// Objeto rota
const AlocacaoBolsistaObject = new AlocacaoBolsistaGenericObject({});

onMounted(async () => {
    if (params.id) {
        getAlocacoes();
        page.value.title = `Completar dados do projeto: ${page.value.project}`;
    }
});

const getAlocacoes = async () => {
    const ProjetoObject = new ProjetoGenericObject({ id: idProjeto() });
    const { list: listProjeto } = services(ProjetoObject.projetoForm);
    
    const response = await listProjeto();
    const data = response.value[0];
    
    
    page.value.project = data.Nome
    items.value = data.AlocacaoBolsistas
}

const idProjeto = () => {
    return Array.isArray(params.id) ? params.id.join(','): params.id
}

// Funcoes busca
const genericSearch = async (url: string) => {
    const { list: listProjeto } = services(url);
    const response = await listProjeto();
    const data = response.value[0];
    items.value = data.AlocacaoBolsistas;
}

const searchPessoa = async () => {
    if (search.value && !searchStatus.value) {
        const ProjetoObject = new ProjetoGenericObject({ id: idProjeto(), filter: search.value });
        genericSearch(ProjetoObject.projetoPessoa);
    } else if (!search.value && searchStatus.value) {
        const ProjetoObject = new ProjetoGenericObject({ id: idProjeto() }, searchStatus.value);
        genericSearch(ProjetoObject.projetoStatus);
    } else if (search.value && searchStatus.value) {
        const ProjetoObject = new ProjetoGenericObject({ id: idProjeto(), filter: search.value }, searchStatus.value);
        genericSearch(ProjetoObject.projetoFiltro);
    } else {
        getAlocacoes();
    };
};

// Funcoes enviar
const submitCotas = async (item: { Id: string; QtdeCotasPagas: string }) => {
    try {
        formAlocacao.Id = item.Id
        formAlocacao.id = item.Id
        formAlocacao.CotasPagas = item.QtdeCotasPagas
        const { post: postCompletarCota } = services(AlocacaoBolsistaObject.completarCota);
        const response = await postCompletarCota(formAlocacao);
        
    } catch (error: any) {
        
    }
    
};

const submitCancelarAlocacao = async () => {
    try {
        const { post: postCancelarAlocacao } = services(AlocacaoBolsistaObject.cancelarAlocacao);
        const response = await postCancelarAlocacao(formCancel);
        
        closeDialogCancel();
        closeDialogEditCancelAlocacao();
        getAlocacoes();
    } catch (error: any) {
        
    };
};

// Dates
const formattedDataFimAtividade = computed({
  get: () => {
    return formCancel.DataFimAtividade
      ? formCancel.DataFimAtividade.split('T')[0]
      : '';
  },
  set: (value) => {
    formCancel.DataFimAtividade = value;
  },
});

// Dialogs
const dialogCancel = ref(false);
const cancelAlocacao = (item: ItemCancelInterface) => {
    dialogCancel.value = true;
    mergeFormCancelItem(item);
};
const mergeFormCancelItem = (item: ItemCancelInterface) => {
    formCancel.DataFimAtividade = item.DataFimAtividade;
    formCancel.Nome = item.Pessoa.Nome;
    formCancel.JustificativaCancelamento = item.JustificativaCancelamento;
    formCancel.Id = item.Id;
    formCancel.id = item.Id;
    
};

const closeDialogCancel = () => {
    dialogCancel.value = false;
};

const dialogEditCancelAlocacao = ref(false);
const editEditCancelAlocacao = (item: ItemCancelInterface) => {
    dialogEditCancelAlocacao.value = true;
    mergeFormCancelItem(item);
};
const closeDialogEditCancelAlocacao = () => {
    dialogEditCancelAlocacao.value = false;
};

const dialogEditCancelAlocacaoSemJustificativa = ref(false);
const editEditCancelAlocacaoSemJustificativa = (item: ItemCancelInterface) => {
    dialogEditCancelAlocacaoSemJustificativa.value = true;
    mergeFormCancelItem(item);

};
const closeDialogEditCancelAlocacaoSemJustificativa = () => {
    dialogEditCancelAlocacaoSemJustificativa.value = false;
};

const workedEnoughDays = (dataFim: string): boolean => {
    const endDate = new Date(dataFim);
    const endDay = endDate.getDate();
    return endDay >= 15;
};
</script>

<style scoped>
.small-input {
    max-width: 70px;
    background-color: rgb(230, 230, 230);
    outline: none;
}
.d-flex {
    display: flex;
}
.align-items-center {
    align-items: center;
}

.warningDialogCancel {
    font-size: 14px;
    color: #AE1212;
}

.input-error {
    border: 2px solid #AE1212;
}

.navigate-back:hover {
    cursor: pointer;
}

.text-base {
    font-size: 16px;
}

.text-sm {
    font-size: 14px;
}
</style>