<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"/>
    <form @submit.prevent="onSubmit">
        <UiParentCard title="Informações da versão da modalidade" class="mb-4">
            <v-row>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Resolução *</v-label>
                    <v-combobox
                        :items="resolucoes"
                        item-title="numero"
                        item-value="id"
                        placeholder="Selecione uma resolução"
                        hide-details
                        required
                        :return-object="false"
                        v-model="formNovaVersaoModalidade.ResolucaoId"
                        data-test="comboBoxResolucaoId"
                    >
                    </v-combobox>
                    <v-label class="font-weight-small mt-1 custom-titles-hint">Resolução que define a nova versão da modalidade.</v-label>
                </v-col>
                <v-col cols="6">
                    <v-label class="font-weight-medium mb-2 custom-titles">Data de início vigência *</v-label>
                    <VTextField
                        placeholder="dd/mm/aaaa"
                        type="date"
                        hide-details
                        required
                        v-model="formNovaVersaoModalidade.DataInicioVigencia"
                        data-test="inputDataInicioVigencia"
                    ></VTextField>
                </v-col>
                <v-col cols="6">
                    <v-label class="font-weight-medium mb-2 custom-titles">Nome da versão *</v-label>
                    <VTextField
                        type="text"
                        placeholder="Ex: 2024"
                        hide-details
                        required
                        v-model="formNovaVersaoModalidade.Sigla"
                        max-length="20"
                        :prefix="formModalidade.Sigla.concat('-')"
                        data-test="inputNomeVersao"
                    ></VTextField>
                </v-col>
            </v-row>
        </UiParentCard>
        <UiParentCard title="Informações sobre a modalidade" class="mb-4">
            <v-row>
                <v-col cols="8">
                    <v-label class="font-weight-medium mb-2 custom-titles">Nome da modalidade</v-label>
                    <VTextField
                        type="text"
                        placeholder="Digite o nome da modalidade da bolsa"
                        hide-details
                        required
                        v-model="formModalidade.Nome"
                        :disabled="disabled"
                        data-test="inputModalidadeNome"
                    ></VTextField>
                </v-col>
                <v-col cols="4">
                    <v-label class="font-weight-medium mb-2 custom-titles">Sigla</v-label>
                    <VTextField
                        type="text"
                        placeholder="Ex: BPIG"
                        hide-details
                        required
                        v-model="formModalidade.Sigla"
                        :disabled="disabled"
                        max-length="20"
                        data-test="inputModalidadeSigla"
                    ></VTextField>
                </v-col>
            </v-row>
        </UiParentCard>
        <v-data-table class="border rounded-md" :headers="headersRequisitos" :items="requisitos" data-test="dataTableRequisitos">
            <template v-slot:top>
                <v-toolbar class="rounded-t-md" flat>
                    <v-toolbar-title>Requisitos da modalidade</v-toolbar-title>
                    <v-spacer></v-spacer>                
                </v-toolbar>
            </template>
            <template v-slot:item.Descricao="{ item }: { item: ItemTabelaInterface }">
                <div class="descricao-cell">{{ item.Descricao }}</div>
            </template>
            <template v-slot:no-data>
                <v-label>Sem dados!</v-label>
            </template>
        </v-data-table>

        <v-data-table class="border rounded-md mt-4" :headers="headersNiveis" :items="niveis" data-test="dataTableNiveis">
            <template v-slot:top>
                <v-toolbar class="rounded-t-md" flat>
                    <v-toolbar-title>Níveis e requisitos de níveis</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:no-data>
                <v-label>Sem dados!</v-label>
            </template>
        </v-data-table>
        <v-row justify="end" class="pa-3">
            <v-btn color="primary" class="ma-2" variant="outlined" @click="navigateBack" data-test="buttonCancelar">Cancelar</v-btn>
            <v-btn color="primary" class="ma-2" type="submit" data-test="buttonSubmit">Criar versão da modalidade</v-btn>
        </v-row>
    </form>
</template>

<style scoped>
.descricao-cell {
    white-space: normal;
    word-break: break-word;
    max-width: 600px;
}

.link-href {
    color: blue;
    text-decoration: underline;
}

.custom-titles {
    opacity: 1;
}

.custom-titles-hint {
    opacity: 0.75;
}
</style>

<script async setup lang="ts">
// IMPORTACOES
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import services from '../../../services/requires/require';

// DECLARACAO E INICIALIZACAO
// Boolean
const disabled = ref();
// Arrays
const requisitos = ref([]);
const requisitosNivel = ref([]);
const tiposRequisitos = ref([
    { tipo: 'Qualificação', value: 0 },
    { tipo: 'Vínculo', value: 1 },
    { tipo: 'Acúmulo', value: 2 },
    { tipo: 'Residência', value: 3 },
    { tipo: 'Documentação', value: 4 },
    { tipo: 'Vigência', value: 5 },
    { tipo: 'Parentesco', value: 6 },
    { tipo: 'Adimplência', value: 7 },
    { tipo: 'Outro', value: 8 }
]);
const resolucoes = ref<{ numero: string; id: any }[]>([]);
const niveis = ref<NivelCompletoVersaoModalidadeInterface[]>([]);
const modalidadesSelect = ref<{sigla: string; id: string}[]>([]);
// Relativo a rotas
const router = useRouter();
const route = useRoute();
const params = route.params;
const page = ref({ title: 'Criar nova versão de modalidade de bolsa' });
const breadcrumbs = ref([
    { text: 'Modalidade', disabled: false, href: '/modalidade/IndexModalidade' },
    { text: page.value.title, disabled: true, href: '#' }
]);
const submitButtonText = ref('Salvar');
// Headers tabelas
const headersRequisitos = ref([
    { title: 'Tipo', sortable: false, key: 'Tipo' },
    { title: 'Requisito', sortable: false, key: 'Descricao' }
]);
const headersNiveis = ref([
    { title: 'Sigla', sortable: false, key: 'Sigla' },
    { title: 'Valor', sortable: false, key: 'Valor' },
    { title: 'Moeda', sortable: false, key: 'Moeda' }
]);
// Services
import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
import ResolucaoGenericObject from '@/services/requires/objects/modalidadebolsa/Resolucao';
import VersaoModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/VersaoModalidade';
const ModalidadeObject = new ModalidadeGenericObject({});
const ResolucaoObject = new ResolucaoGenericObject({});


const VersaoModalidadeObject = new VersaoModalidadeGenericObject({});

const { list: listModalidade } = services(ModalidadeObject.modalidadeCount);
const { post: postVersaoModalidade, update: updateVersaoModalidade } = services(VersaoModalidadeObject.entity);
const { list: listResolucao } = services(ResolucaoObject.entity);

// Forms
const formModalidade = reactive({
    Sigla: '',
    Nome: '',
    Id: ''
});
const formVersaoModalidade = reactive({
    Estado: null as string | null,
    Sigla: '',
    ResolucaoId: null,
    ModalidadeBolsaId: '',
    ReducaoPorVinculo: null as number | null,
    DataInicioVigencia: '',
    Id: '',
    Descricao: '',
    id: '',
    ModalidadeBolsaCompativeis: [] as never[] | any[]
});
const formNovaVersaoModalidade = reactive({
    Estado: null as string | null,
    Sigla: '',
    ResolucaoId: null,
    ModalidadeBolsaId: '',
    ReducaoPorVinculo: null as number | null,
    DataInicioVigencia: '',
    Id: '',
    Descricao: '',
    id: '',
    ModalidadeBolsaCompativeis: [] as never[] | any[],
})
// Interfaces
interface ResolucaoInterface {
    Numero: number;
    Id: number;
}
interface VersaoModalidadeInterface {
    Sigla: string;
    VersaoNiveis: never[]; 
    Estado: string; 
    DataInicioVigencia: string | number | Date | dayjs.Dayjs | null | undefined; 
    Resolucao: { Id: null; }; 
    RequisitoBolsas: never[]; 
    Id: string; 
    ReducaoPorVinculo: null;
    ModalidadeBolsaCompativeis: {Id: null}[];
    Descricao: string;
}
interface NivelVersaoModalidadeInterface {
    Id: string;
    Valor: number;
    Moeda: { Nome: string, Id: string };
    NivelBolsa: { Sigla: string, Id: string };
    RequisitoBolsas: [];
}
interface NivelCompletoVersaoModalidadeInterface {
    Id: string;
    Sigla: string;
    Valor: string;
    Moeda: string;
    MoedaId: string;
    NivelId: string;
    Requisitos: [];
}
interface ItemTabelaInterface {
    Descricao: string;
}
// AO CARREGAR A PAGINA
onMounted(async () => {
    getPostsResolucao();
    getPostsModalidade();
    if (params.id) {
        const ModalidadeObject = new ModalidadeGenericObject({ id: Array.isArray(params.id) ? params.id.join(','): params.id });
        const { list: listConsultarModalidade } = services(ModalidadeObject.modalidadeConsult);
        const alterarModalidade = await listConsultarModalidade();
        carregarModalidade(alterarModalidade.value[0]);
        desativarCampos();
        formVersaoModalidade.ModalidadeBolsaId = validarParametroRota();
        carregarVersao(alterarModalidade, 'ATIVA');
        alterarTituloPagina('Criar nova versão de modalidade de bolsa');
    }
});

// FUNCOES AO CARREGAR A PAGINA
const alterarTituloPagina = (titulo: string) => {
    page.value.title = titulo;
    breadcrumbs.value[1].text = titulo;
};
const carregarModalidade = (modalidade: any) => {
    formModalidade.Nome = modalidade.Nome;
    formModalidade.Sigla = modalidade.Sigla;
};
const desativarCampos = () => {
    disabled.value = true;
};
const carregarVersao = (versaoModalidade: any, estado: string) => {
    versaoModalidade.value[0].VersaoModalidadesBolsas.forEach((versaoModalidade: VersaoModalidadeInterface) => {
        if (versaoModalidade.Estado == estado) {
            formVersaoModalidade.Sigla = versaoModalidade.Sigla;
            formVersaoModalidade.Descricao = versaoModalidade.Descricao;
            formVersaoModalidade.ReducaoPorVinculo = versaoModalidade.ReducaoPorVinculo;
            requisitos.value = versaoModalidade.RequisitoBolsas;
            
            formVersaoModalidade.ModalidadeBolsaCompativeis = versaoModalidade.ModalidadeBolsaCompativeis.map(item => item.Id)
            formVersaoModalidade.ModalidadeBolsaCompativeis = criarBolsasCompativeisForm();
            carregarNiveisVersao(versaoModalidade);
        }
    });
}

const carregarNiveisVersao = (versaoModalidadeEmEdicao: any) => {
    versaoModalidadeEmEdicao.VersaoNiveis.forEach((nivelVersaoModalidade: NivelVersaoModalidadeInterface) => {
        
        const nivelCompletoVersaoModalidade: NivelCompletoVersaoModalidadeInterface = {
            Id: nivelVersaoModalidade.Id,
            Valor: Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nivelVersaoModalidade.Valor),
            Moeda: nivelVersaoModalidade.Moeda.Nome,
            MoedaId: nivelVersaoModalidade.Moeda.Id,
            Sigla: nivelVersaoModalidade.NivelBolsa.Sigla,
            NivelId: nivelVersaoModalidade.NivelBolsa.Id,
            Requisitos: nivelVersaoModalidade.RequisitoBolsas
        };
        niveis.value.push(nivelCompletoVersaoModalidade)
        
    });
};

const validarParametroRota = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    } else {
        return params.id;
    };
};

// NAVEGACAO
const navigateBack = () => {
    router.push({ path: `/modalidade/DetailsModalidade/${params.id}` });
};

// RESOLUCAO
const getPostsResolucao = async () => {
    try {
        let data = await listResolucao();
        data.value = await listaCompleta(data);
        geraListaResolucoes(data);
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};
const listaCompleta = async (data: any) => {
    let lista = data.value;
    let data2 = data;
    while (data2["@odata.nextLink"]) {
        const ResolucaoObject = new ResolucaoGenericObject({ skipToken: data2["@odata.nextLink"].split("=")[1] });
        const { list:listResolucaoPaginacao } = services(ResolucaoObject.paginacaoToken);
        data2 = await listResolucaoPaginacao();
        lista = lista.concat(data2.value); 
    }
    return lista;
};
const geraListaResolucoes = (data: any) => {
    resolucoes.value = [];
    data.value.forEach((element: ResolucaoInterface) => {
        resolucoes.value.push({
            numero: `Resolução ${element.Numero}`,
            id: element.Id
        });
    });
};

// MODALIDADE E VERSAO MODALIDADE
const getPostsModalidade = async () => {
    try {
        const data = await listModalidade();
        modalidadesSelect.value = [];
        data.value.forEach((element: { Sigla: string; Id: string }) => {
            modalidadesSelect.value.push({sigla: element.Sigla, id: element.Id});
        });
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

const onSubmit = async () => {
    try {
        prepararVersaoModalidadePost();
        await postVersaoModalidade(formVersaoModalidade);
        salvoComSucesso();
        router.push({ name: 'EditarModalidade', params: { id: formVersaoModalidade.ModalidadeBolsaId } });
    } catch (error: any) {
        erroSubmit(error);
    };
};

// FUNCOES PARA ONSUBMIT
const prepararVersaoModalidadePost = () => {
    formVersaoModalidade.ResolucaoId = formNovaVersaoModalidade.ResolucaoId;
    formVersaoModalidade.DataInicioVigencia = formNovaVersaoModalidade.DataInicioVigencia;
    formVersaoModalidade.Sigla = formModalidade.Sigla.concat('-', formNovaVersaoModalidade.Sigla);
    // formNovaVersaoModalidade.Sigla = formModalidade.Sigla.concat('-', formNovaVersaoModalidade.Sigla)
};
const salvoComSucesso = () => {
    Swal.fire({ title: 'Salvo com sucesso!', icon: 'success', showConfirmButton: false, timer: 1000 });
};
const criarBolsasCompativeisForm = () => {
    return Object.values(formVersaoModalidade.ModalidadeBolsaCompativeis).map(value => ({ id: value }));
};
const erroSubmit = (error:any) => {
    console.error(error);
    if (error.response.data.errors) {
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: error.response.data.errors[0].mensagem, confirmButtonColor: '#D3D3D3' })
        return
    };
    if (error.response.data.message){
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: error.response.data.message, confirmButtonColor: '#D3D3D3' });
        return
    };
    Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: "Ocorreu um erro não identificado!", confirmButtonColor: '#D3D3D3' });
};
</script>