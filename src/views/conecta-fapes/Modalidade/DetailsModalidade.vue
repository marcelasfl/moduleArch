<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" data-test="componentBreadcrumb"/>

  <p v-if="hasActiveVersion" class="text-sm text-muted mb-2">
    <strong>Visualizando a versão ativa {{ form.SiglaAtual }}</strong>
  </p>

  <v-alert v-if="hasDraftVersion" type="info" class="mt-4" dense border="start" data-test="alertDraftVersion">
    Essa modalidade ativa possui uma versão <strong>em andamento</strong>. Deseja visualizá-la?
    <router-link :to="`/modalidade/DetailsModalidadeEmEdicao/${id}`" data-test="linkVisualizarVersao">Clique aqui para visualizar.</router-link>
  </v-alert>

  <form @submit.prevent="onSubmit" class="mt-6" data-test="formModalidade">
    <v-row>
      <v-col cols="8">
        <v-card elevation="10" rounded="md" data-test="cardDadosModalidade">
          <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
            <v-row>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Versão ativa</v-label>
                <VTextField type="text" hide-details v-model="form.SiglaAtual" disabled data-test="inputVersaoAtiva"></VTextField>
              </v-col>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Resolução</v-label>
                <VTextField type="text" hide-details v-model="form.NumeroResolucao" disabled data-test="inputNumeroResolucao"></VTextField>
              </v-col>

              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">Nome da modalidade</v-label>
                <VTextField type="text" hide-details v-model="form.Nome" disabled data-test="inputNomeModalidade"></VTextField>
              </v-col>

              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Sigla</v-label>
                <VTextField type="text" hide-details v-model="form.Sigla" disabled data-test="inputSigla"></VTextField>
              </v-col>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Data de início de vigência</v-label>
                <VTextField type="date" hide-details v-model="form.DataInicioVigencia" disabled data-test="inputDataInicioVigencia"></VTextField>
              </v-col>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Data de fim de vigência</v-label>
                <VTextField type="text" hide-details :value="form.DataFimVigencia ? form.DataFimVigencia : 'sem data'" disabled data-test="inputDataFimVigencia"></VTextField>
              </v-col>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Redução do vínculo (%)</v-label>
                <VTextField type="number" hide-details v-model="form.ReducaoPorVinculo" disabled data-test="inputReducaoVinculo"></VTextField>
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">Descrição</v-label>
                <VTextField textarea auto-grow rows="4" hide-details v-model="form.Descricao" disabled data-test="inputDescricao"></VTextField>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>

      </v-col>

      <v-col cols="4">
        <v-card elevation="8" rounded="md" data-test="cardVersoesModalidade">
          <v-card-title class="font-weight-medium">
            <strong>Versões da modalidade {{ form.Sigla }} </strong>
          </v-card-title>
          <v-card-text class="pa-sm-1 pa-3 pb-sm-5 pb-2">
            <v-list data-test="listVersoes">
              <v-list-item v-if="versoes.length === 0" data-test="listItemSemVersoes">
                <p>Não existem versões disponíveis dessa modalidade!</p>

              </v-list-item>
              <v-list-item v-else v-for="(versao, index) in versoes" :key="index" data-test="listItemVersao">
                <v-list-item-content>
                  <v-list-item-title>
                    <span>{{ versao.Sigla }}</span>
                    <v-btn v-if="versao.Estado === 'EM_EDICAO'" :to="`/modalidade/DetailsModalidadeEmEdicao/${form.Id}`"
                      class="mdi mdi-arrow-top-right no-focus-border" small icon data-test="buttonVisualizarVersao"
                      style="border: none !important; box-shadow: none !important;">
                    </v-btn>
                  </v-list-item-title>
                  <span :class="getStateClass(versao.Estado)" data-test="spanEstadoVersao">
                    {{ formatEstado(versao.Estado) }}
                  </span>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-data-table class="border rounded-md" :headers="headersRequisitos" :items="requisitos" data-test="dataTableRequisitos">
          <template v-slot:top>
            <v-toolbar class="rounded-t-md" flat>
              <v-toolbar-title>Requisitos da modalidade</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:no-data>
            <v-alert text="Não há dados"></v-alert>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="mt-4">
        <v-data-table class="border rounded-md" :headers="headersNiveis" :items="niveisAtivos" data-test="dataTableNiveis">
          <template v-slot:top>
            <v-toolbar class="rounded-t-md" flat>
              <v-toolbar-title>Níveis e requisitos de níveis</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>

          <template v-slot:no-data>
            <v-alert text="Não há dados"></v-alert>
          </template>
        </v-data-table>
      </v-col>
      <v-btn color="error" class="ma-2" variant="outlined" @click="DesativarVersaoModalidade(form.Id)" :disabled="versoes.every(m => m.Estado === 'INATIVA')" data-test="buttonDesativarModalidade">Desativar
        modalidade</v-btn>
      <v-btn color="primary" class="ma-2" @click="criarVersaoModalidade(form.Id)" v-if="!(versoes.every(m => m.Estado === 'INATIVA'))" data-test="buttonCriarNovaVersao">Criar nova versão da
        modalidade</v-btn>
    </v-row>
  </form>
</template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Swal from 'sweetalert2';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import modalidadeService from '../../../services/requires/require';
dayjs.extend(utc);

type EditingModePageParams = {
  id: string
}

interface VersaoModalidade {
  Id: string;
  Estado: string;
  Sigla: string;
  Resolucao: { Numero: string };
  ReducaoPorVinculo: string;
  DataInicioVigencia: string;
  DataFimVigencia: string;
  Descricao: string;
  RequisitoBolsas: any[];
}
const niveisAtivos = computed(() => niveis.value.filter((m) => m.Estado === 'ATIVA'));


interface Modalidade {
  Id: string;
  Sigla: string;
  Nome: string;
  Estado: string;
  Ativa: string | null;
  EmEdicao: string | null;
  VersaoModalidadesBolsas: VersaoModalidade[];
}

const headersNiveis = ref([
  { title: 'Sigla', sortable: false, key: 'Sigla' },
  { title: 'Valor', sortable: false, key: 'Valor' },
  { title: 'Moeda', sortable: false, key: 'Moeda' }
]);

const route = useRoute();
const params = route?.params as EditingModePageParams;
const id = params?.id;
// Computed property para filtrar os níveis com estado 'ATIVA'
// Filtra os níveis com estado 'ATIVA' ao carregar os dados
// const niveisAtivos = computed(() => niveis.value.filter(nivel => nivel.Estado === 'ATIVA'));
const ModalidadeObject = new ModalidadeGenericObject({ id: id });
const { post, getById, update } = modalidadeService(ModalidadeObject.modalidadeDetails);
const modalidade = ref<Modalidade[]>([]);
const niveis = ref<nivelCompletoVersaoModalidadeInterface[]>([]);
const versoes = ref<VersaoModalidadeInterface[]>([]);
const router = useRouter();
const requisitos = ref([]);
const headersRequisitos = ref([
  { title: 'Tipo', sortable: false, key: 'Tipo' },
  { title: 'Requisito', sortable: false, key: 'Descricao' },
]);

interface VersaoModalidadeInterface {
  Sigla: string;
  Estado: string;
  [key: string]: any;
}


function formatEstado(estado: string): string {
  const estadosMap: Record<string, string> = {
    ATIVA: 'Ativa',
    EM_EDICAO: 'Em edição',
    INATIVA: 'Inativa',
  };
  return estadosMap[estado] || estado;
}


function getStateClass(estado: string): Record<string, boolean> {
  return {
    'text-success': estado === 'ATIVA',
    'text-warning': estado === 'EM_EDICAO',
    'text-danger': estado === 'INATIVA',
  };
}

interface nivelCompletoVersaoModalidadeInterface {
  Id: string;
  Sigla: string;
  Valor: string;
  Moeda: string;
  Estado:string
}

interface Form {
  Id: string;
  Sigla: string;
  SiglaAtual: string;
  Nome: string;
  Descricao: string;
  NumeroResolucao: string;
  ReducaoPorVinculo: number | null;
  DataInicioVigencia: string;
  DataFimVigencia: string;
  ModalidadesCompativeis: string;
  [key: string]: any;
}

const form = ref<Form>({
  Id: '',
  Sigla: '',
  SiglaAtual: '',
  Nome: '',
  Descricao: '',
  NumeroResolucao: '',
  ReducaoPorVinculo: null,
  DataInicioVigencia: '',
  DataFimVigencia: '',
  ModalidadesCompativeis: ''
});


function verDetalhesEdicao(id: string) {
  router.push({ path: `/modalidades/DetailsModalidadeEmEdicao/${id}` });
}

const hasDraftVersion = ref(false);
const hasActiveVersion = computed(() => {
  return !!form.value.SiglaAtual;
});


const DesativarVersaoModalidade = async (id: string) => {
  Swal.fire({
    title: "Tem certeza que quer desativar essa versão da modalidade?",
    text: "Essa ação é definitiva e irreversível.",
    showCancelButton: true,
    confirmButtonText: "Desativar",
    confirmButtonColor: "#D3D3D3",
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#F4796B'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const modalidadeAtual = modalidade.value.find(m => m.VersaoModalidadesBolsas.some(v => v.Id === id && v.Estado === 'ATIVA'));

        if (modalidadeAtual && modalidadeAtual.VersaoModalidadesBolsas.length === 1) {
          const { desactive } = modalidadeService('/modalidade');
          await desactive(modalidadeAtual.Id);
          
        }

        const { desactive } = modalidadeService('modalidade');
        await desactive(id);
        

        Swal.fire({
          title: 'Versão da modalidade desativada!',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#D3D3D3'
        });
        router.push({ path: '/modalidade/IndexModalidade' });

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro ao desativar versão da modalidade!",
          confirmButtonText: 'Ok',
          confirmButtonColor: '#D3D3D3'
        });
      }
    }
  });
};

const getPosts = async () => {
  try {
    const response = await getById();
    const modalidadeData = response.value[0];
    
    modalidadeData.Data = dayjs(modalidadeData.Data).format('YYYY-MM-DD');

    Object.assign(form.value, modalidadeData);

    let activeVersion = modalidadeData.VersaoModalidadesBolsas.find(
      (versao: VersaoModalidade) => versao.Estado === 'ATIVA'
    );

    // if (!activeVersion) {
    //   activeVersion = modalidadeData.VersaoModalidadesBolsas.find(
    //     (versao: VersaoModalidade) => versao.Estado === 'INATIVA'
    //   );
    // }

    niveis.value = modalidadeData.VersaoModalidadesBolsas.flatMap((versao: any) => versao.VersaoNiveis.map((nivel: any) => ({
        Sigla: nivel.NivelBolsa.Sigla,
        Valor: Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nivel.Valor),
        Moeda: nivel.Moeda.Nome,
        Estado: versao.Estado,
    })));

    if (activeVersion) {
      form.value.NumeroResolucao = activeVersion.Resolucao.Numero;
      form.value.SiglaAtual = activeVersion.Sigla;
      form.value.ReducaoPorVinculo = activeVersion.ReducaoPorVinculo * 100;
      form.value.DataInicioVigencia = dayjs(activeVersion.DataInicioVigencia).utc().format('YYYY-MM-DD');
      form.value.DataFimVigencia = activeVersion.DataFimVigencia ? dayjs(activeVersion.DataFimVigencia).utc().format('YYYY-MM-DD') : '--';

      form.value.Descricao = activeVersion.Descricao;
      requisitos.value = activeVersion.RequisitoBolsas;

      hasDraftVersion.value = modalidadeData.VersaoModalidadesBolsas.some(
        (versao: VersaoModalidade) => versao.Estado === 'EM_EDICAO'
      );
      
    }

    versoes.value = modalidadeData.VersaoModalidadesBolsas;
  } catch (error) {
    console.error(error);
  }
};

const onSubmit = async () => {
  try {
    if (params.id) {
      await update({ id: form.value.Id, ...form.value });
    } else {
      await post(form.value);
    }
    alert('Salvo com sucesso');
    router.push({ path: '/modalidade/IndexModalidade' });
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar');
  }
};

const page = ref({ title: 'Visualizar Versão da Modalidade' });
const criarVersaoModalidade = (id: string) => {
  router.push({ path: `/modalidade/CreateVersaoModalidade/${id}` });
};

onMounted(async () => {
  await getPosts();
  if (params.id) {
    breadcrumbs.value[1].text = page.value.title;
  }
});

const breadcrumbs = ref([
  {
    text: 'Modalidade',
    disabled: false,
    href: '/modalidade/IndexModalidade',
  },
  {
    text: page.value.title,
    disabled: true,
    href: '#',
  },
]);

</script>
<style>
.no-focus-border {
  border: none;
  box-shadow: none;
  background-color: transparent;
}

.no-focus-border:focus {
  border: none;
  box-shadow: none;
  background-color: transparent;
}
</style>