<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    <UiParentCard title="Informações da Modalidade" class="mb-4">
        <form @submit.prevent="onSubmit">
            <v-row>
                <v-col cols="8">
                    <v-label class="font-weight-medium mb-2 custom-titles">Resolução *</v-label>
                    <v-combobox
                        :items="resolucoes"
                        item-title="numero"
                        item-value="id"
                        placeholder="Selecione uma resolução"
                        hide-details
                        required
                        :return-object="false"
                        v-model="formVersaoModalidade.ResolucaoId"
                        data-test="comboBoxResolucaoId"
                    ></v-combobox>
                    <v-label class="font-weight-small mt-1 custom-titles-hint">
                        Resolução que define a modalidade. Não encontrou a resolução?
                        <a class="ml-1 link-href" @click="incluirResolucao" data-test="linkIncluirResolucao"> Cadastrar</a>
                    </v-label>
                </v-col>
                <v-col cols="4">
                    <v-label class="font-weight-medium mb-2 custom-titles">Sigla *</v-label>
                    <v-text-field
                        type="text"
                        placeholder="Ex: BPIG"
                        hide-details
                        required
                        v-model="formModalidade.Sigla"
                        maxlength="20"
                        :disabled="disabled"
                        @input="atualizarContadorSigla"
                        data-test="inputModalidadeSigla"
                    ></v-text-field>
                    <v-label class="font-weight-small mt-1 custom-titles-hint" v-if="contadorSigla == 0">Identificação curta da modalidade.</v-label>
                    <v-label class="font-weight-small mt-1 custom-titles-hint"
                            :class="{ 'text-danger': contadorSigla > 10 }" v-else>
                        {{ contadorSigla }}/10 caracteres
                    </v-label>
                </v-col>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Nome da modalidade *</v-label>
                    <v-text-field
                        type="text"
                        placeholder="Digite o nome da modalidade da bolsa (até 100 caracteres.)"
                        hide-details
                        required
                        v-model="formModalidade.Nome"
                        :disabled="disabled"
                        maxlength="100"
                        data-test="inputModalidadeNome"
                    ></v-text-field>
                    <v-label class="font-weight-small mt-1 custom-titles-hint">Nome completo da modalidade</v-label>
                </v-col>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Descrição *</v-label>
                    <v-textarea
                        auto-grow
                        placeholder="Escreva os objetivos da modalidade em até 500 caracteres"
                        rows="2"
                        color="primary"
                        row-height="25"
                        shaped
                        hide-details
                        required
                        @input="atualizaContador"
                        v-model="formVersaoModalidade.Descricao"
                        data-test="textAreaModalidadeDescricao"
                    ></v-textarea>
                    <v-label
                        class="font-weight-small mt-1"
                        :class="{ 'text-danger': contadorDescricao > 500 }"
                    >
                        {{ contadorDescricao }}/500 caracteres
                    </v-label>
                </v-col>
                <v-col cols="6" class="pt-0">
                    <v-checkbox
                        density="compact"
                        hide-details
                        color="primary"
                        label="Redução em caso de vínculo empregatício (%) *"
                        v-model="haReducaoPorVinculo"
                        data-test="checkboxReducaoPorVinculo"
                    ></v-checkbox>
                    <v-text-field
                        type="number"
                        placeholder="Apenas número inteiros. Ex.: 60"
                        hide-details
                        v-model="formVersaoModalidade.ReducaoPorVinculo"
                        :disabled="!haReducaoPorVinculo"
                        min="0"
                        max="100"
                        suffix="%"
                        data-test="inputReducaoPorVinculo"
                    ></v-text-field>
                    <v-label class="font-weight-small mt-1 custom-titles-hint">
                        Percentual do valor da bolsa a ser pago em caso de vínculo empregatício.
                    </v-label>
                </v-col>
                <v-col cols="6">
                    <v-label class="font-weight-medium mb-2 custom-titles">Data de vigência *</v-label>
                    <v-text-field
                        placeholder="dd/mm/aaaa"
                        type="date"
                        hide-details
                        required
                        v-model="formVersaoModalidade.DataInicioVigencia"
                        :min="minDate"
                        :max="maxDate"
                        data-test="inputDataInicioVigencia"
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Modalidades de bolsa acumulativas *</v-label>
                    <v-select
                        :items="modalidadesSelect"
                        item-title="sigla"
                        item-value="id"
                        hide-details
                        placeholder="Selecione as modalidades acumulativas"
                        multiple
                        v-model="formVersaoModalidade.ModalidadeBolsaCompativeis"
                        data-test="selectModalidadesAcumulativas"
                    ></v-select>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                    <v-btn type="button" color="primary" variant="outlined" class="mr-3" @click="navigateBack" data-test="buttonVoltar">Voltar</v-btn>
                    <v-btn type="submit" color="primary" flat data-test="buttonSalvar">Salvar</v-btn>
                </v-col>
            </v-row>
        </form>
    </UiParentCard>

    <v-data-table class="border rounded-md" :headers="headersRequisitos" :items="requisitos">
        <template v-slot:top>
            <v-toolbar class="rounded-t-md" flat>
                <v-toolbar-title>Requisitos da modalidade</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogRequisito" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="cinza500" variant="tonal" dark v-bind="attrs" v-on="on" data-test="buttonAdicionarRequisito">Adicionar requisito</v-btn>
                    </template>
                </v-dialog>
            </v-toolbar>
        </template>
    </v-data-table>
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
    cursor: pointer;
}

.custom-titles {
    opacity: 1;
}

.custom-titles-hint {
    opacity: 0.75;
}

.text-danger {
    color: red;
}
</style>

<script async setup lang="ts">
// IMPORTACOES
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import services from '../../../services/requires/require';

// Definição de data máxima e mínima
const minDate = '1960-01-01';
const maxDate = '9999-12-30';

// DECLARACAO E INICIALIZACAO
// BOOLEANOS
const botaoAdicionarTabelas = ref(false);
const dialogRequisito = ref(false);
const dialogNiveis = ref(false);
const haReducaoPorVinculo = ref(false);
const disabled = ref(false);

// NUMBER
const contadorDescricao = ref(0);

// ARRAYS
const requisitos = ref([]);
const resolucoes = ref<{ numero: string; id: any }[]>([]);
const niveis = ref<NivelCompletoVersaoModalidadeInterface[]>([]);
const modalidadesSelect = ref<{ sigla: string; id: string }[]>([]);

// ROTAS E RELATIVOS
const router = useRouter();
const route = useRoute();
const params = route.params;
const page = ref({ title: 'Incluir Nova Modalidade' });
const breadcrumbs = ref([
    { text: 'Modalidade', disabled: false, href: '/modalidade/IndexModalidade' },
    { text: page.value.title, disabled: true }
]);

// HEADER TABELAS
const headersRequisitos = ref([
    { title: 'Tipo', sortable: false, key: 'Tipo' },
    { title: 'Requisito', sortable: false, key: 'Descricao' },
    { title: 'Ações', sortable: false, key: 'actions' }
]);
const headersNiveis = ref([
    { title: 'Sigla', sortable: false, key: 'Sigla' },
    { title: 'Valor', sortable: false, key: 'Valor' },
    { title: 'Moeda', sortable: false, key: 'Moeda' },
    { title: 'Ações', sortable: false, key: 'actions' }
]);

// SERVICES
import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
import ResolucaoGenericObject from '@/services/requires/objects/modalidadebolsa/Resolucao';
import VersaoModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/VersaoModalidade';
const ModalidadeObject = new ModalidadeGenericObject({});
const ResolucaoObject = new ResolucaoGenericObject({});
const VersaoModalidadeObject = new VersaoModalidadeGenericObject({});

const { list: listModalidade, post: postModalidade } = services(ModalidadeObject.count);
const { post: postVersaoModalidade } = services(VersaoModalidadeObject.entity);
const { list: listResolucao } = services(ResolucaoObject.entity);

// FORMS
const formModalidade = reactive({
    Sigla: '',
    Nome: '',
    Id: ''
});
const formVersaoModalidade = reactive({
    Sigla: '',
    ResolucaoId: null as string | null,
    ModalidadeBolsaId: '',
    ReducaoPorVinculo: null as number | null,
    DataInicioVigencia: '',
    Descricao: '',
    ModalidadeBolsaCompativeis: [] as never[] | any[]
});

// INTERFACES
interface ResolucaoInterface {
    Numero: number;
    Id: number;
};
interface NivelCompletoVersaoModalidadeInterface {
    Id: string;
    Sigla: string;
    Valor: string;
    Moeda: string;
};
interface ItemTabelaInterface {
    Descricao: string;
};

// AO CARREGAR A PAGINA
onMounted(async () => {
    getPostsResolucao();
    getPostsModalidade();
    if (params.resolucao) {
        carregaResolucaoCriada(params.resolucao);
    }
});

// NAVEGACAO
const navigateBack = () => {
    router.push({ path: '/modalidade/IndexModalidade' });
};
const incluirResolucao = () => {
    router.push({ name: 'CadastroResolucao', params: { id: null, modalidade: 'CreateModalidade' } });
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
    while (data2['@odata.nextLink']) {
        const ResolucaoObject = new ResolucaoGenericObject({ skipToken: data2['@odata.nextLink'].split('=')[1] });
        const { list: listResolucaoPaginacao } = services(ResolucaoObject.paginacaoToken);
        data2 = await listResolucaoPaginacao();
        lista = lista.concat(data2.value);
    }
    return lista;
};
const geraListaResolucoes = (data: any) => {
    resolucoes.value = [];
    data.value.forEach((resolucaoItem: ResolucaoInterface) => {
        resolucoes.value.push({ numero: `Resolução ${resolucaoItem.Numero}`, id: resolucaoItem.Id });
    });
};
const carregaResolucaoCriada = (idResolucao: any) => {
    formVersaoModalidade.ResolucaoId = idResolucao;
};

// MODALIDADES COMPATIVEIS - SELECT
const getPostsModalidade = async () => {
    try {
        const data = await listModalidade();
        geraListaModalidadesCompativeis(data);
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};
const geraListaModalidadesCompativeis = (data: any) => {
    modalidadesSelect.value = [];
    data.value.forEach((modalidadeItem: { Sigla: string; Id: string }) => {
        modalidadesSelect.value.push({ sigla: modalidadeItem.Sigla, id: modalidadeItem.Id });
    });
};
const onSubmit = async () => {
    console.log(formModalidade)
    console.log(formVersaoModalidade)
    try {
        const modalidadesExistentes = await listModalidade();
        const nomeExistente = modalidadesExistentes.value.find(
            (modalidadeItem: { Nome: string }) => modalidadeItem.Nome.toLowerCase() === formModalidade.Nome.toLowerCase()
        );
        if (nomeExistente) {
            Swal.fire({
                title: 'Erro ao salvar!',
                text: `Já existe uma modalidade com o nome "${formModalidade.Nome}".`,
                icon: 'error',
                confirmButtonColor: '#D3D3D3'
            });
            return;
        }
        formVersaoModalidade.ModalidadeBolsaCompativeis = criarBolsasCompativeisForm();
        alterarReducaoPorVinculo('division');
        if (formVersaoModalidade.Descricao.length > 500) {
            throw new Error('A Descrição deve ter no máximo 500 caracteres.');
        }
        if (
            isNaN(new Date(formVersaoModalidade.DataInicioVigencia).valueOf()) ||
            parseInt(formVersaoModalidade.DataInicioVigencia.substring(0, 4)) < 1900
        ) {
            throw new Error('Data inválida.');
        }
        reducaoPorVinculoPadrao();
        if (!formVersaoModalidade.ModalidadeBolsaId) {
            const cadastroModalidade = await postModalidade(formModalidade);
            formVersaoModalidade.ModalidadeBolsaId = cadastroModalidade.uri.replace('/api/modalidadebolsa/modalidadebolsa/', '');
            desativarCamposModalidade();
        }
        await postVersaoModalidade(formVersaoModalidade);
        criadoComSucesso();
    } catch (error: any) {
        erroSubmit(error);
    } finally {
        formVersaoModalidade.ModalidadeBolsaCompativeis = resetarBolsasCompativeis();
        alterarReducaoPorVinculo('multiplication');
    }
};

// FUNCOES PARA ONSUBMIT
const desativarCamposModalidade = () => {
    disabled.value = true;
};
const criarBolsasCompativeisForm = () => {
    return Object.values(formVersaoModalidade.ModalidadeBolsaCompativeis).map((value) => ({ id: value }));
};
const alterarReducaoPorVinculo = (operacao: string) => {
    if (operacao == 'multiplication') formVersaoModalidade.ReducaoPorVinculo = (formVersaoModalidade.ReducaoPorVinculo ?? 100) * 100;
    if (operacao == 'division') formVersaoModalidade.ReducaoPorVinculo = (formVersaoModalidade.ReducaoPorVinculo ?? 100) / 100;
};
const resetarBolsasCompativeis = () => {
    return formVersaoModalidade.ModalidadeBolsaCompativeis.map((item) => item.id);
};
const reducaoPorVinculoPadrao = () => {
    if (!haReducaoPorVinculo.value) formVersaoModalidade.ReducaoPorVinculo = 1;
};
const erroSubmit = (error: any) => {
    console.error(error);
    if (error.response && error.response.data.errors) {
        Swal.fire({
            title: 'Erro ao salvar!',
            icon: 'error',
            text: error.response.data.errors[0].mensagem.split(':')[1],
            confirmButtonColor: '#D3D3D3'
        });
        return;
    }
    if (error.response && error.response.data.message) {
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: error.response.data.message, confirmButtonColor: '#D3D3D3' });
        return;
    }
    if (error.message) {
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: error.message, confirmButtonColor: '#D3D3D3' });
        return;
    }
    Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: 'Ocorreu um erro não identificado!', confirmButtonColor: '#D3D3D3' });
};
const criadoComSucesso = () => {
    router.push({ name: 'EditarModalidade', params: { id: formVersaoModalidade.ModalidadeBolsaId } });
    Swal.fire({ title: 'Salvo com sucesso!', icon: 'success', showConfirmButton: false, timer: 1000 });
};
// BOTOES ADICIONAR REQUISITO E NIVEL
const abrirDialog = (tabela: string) => {
    if (!botaoAdicionarTabelas.value) {
        Swal.fire({ icon: 'error', title: `Crie uma modalidade antes de incluir ${tabela}!`, confirmButtonColor: '#D3D3D3' });
    }
};

const contadorSigla = ref(0);

const atualizarContadorSigla = () => {
    contadorSigla.value = formModalidade.Sigla.length;
};

const atualizaContador = () => {
    contadorDescricao.value = formVersaoModalidade.Descricao.length;
};
</script>
