<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" data-test="baseBreadcrumb"/>
  <v-alert v-if="hasDraftVersion" type="info" class="mt-4" dense border="start" data-test="alertVersaoRascunho">
    Essa modalidade possui uma versão <strong>atual</strong> em andamento. Deseja visualizá-la?
    <router-link :to="`/modalidade/DetailsModalidade/${id}`" data-test="linkVisualizarModalidade">Clique aqui para visualizar.</router-link>
  </v-alert>
  
  <form @submit.prevent="onSubmit" class="mt-6" data-test="formModalidade">
    <v-row>
      <v-col cols="8">
        <v-card elevation="10" class="" rounded="md">
          <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
            <v-row>
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Versão em edição</v-label>
                <VTextField type="text" hide-details v-model="form.SiglaEmEdicao" disabled data-test="inputVersaoEmEdicao"></VTextField>
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
                <VTextField type="text" hide-details v-model="form.DataFimVigencia" disabled data-test="inputDataFimVigencia"></VTextField>
              </v-col>
  
              <v-col cols="12">
                <v-label class="font-weight-medium mb-2">Descrição</v-label>
                <VTextField textarea auto-grow rows="4" hide-details v-model="form.DescricaoEmEdicao" disabled data-test="inputDescricaoEmEdicao"></VTextField>
              </v-col>
  
              <v-col cols="6">
                <v-label class="font-weight-medium mb-2">Redução do vínculo (%)</v-label>
                <VTextField type="number" hide-details v-model="form.ReducaoPorVinculo" disabled data-test="inputReducaoVinculo"></VTextField>
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
            <v-list>
              <v-list-item v-if="versoes.length === 0" data-test="listItemVersaoModalidade">
                <p>Não existem versões dessa modalidade!</p>
              </v-list-item>
              <v-list-item v-else v-for="(versao, index) in versoes" :key="index" data-test="listItemVersaoModalidade">
                <v-list-item-content>
                  <v-list-item-title>
                    <span>{{ versao.Sigla }}</span>
                    <v-btn
                      v-if="versao.Estado === 'ATIVA'"
                      :to="`/modalidade/DetailsModalidade/${form.Id}`"
                      class="mdi mdi-arrow-top-right no-focus-border"
                      small
                      icon
                      style="border: none !important; box-shadow: none !important;"
                      data-test="buttonVisualizarVersao"
                    >
                    </v-btn>
                  </v-list-item-title>
                  <span :class="getStateClass(versao.Estado)">
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
        </v-data-table>
      </v-col>
      <v-col cols="12" class="mt-4">
        <v-data-table class="border rounded-md" :headers="headersNiveis" :items="niveis" data-test="dataTableNiveis">
          <template v-slot:top>
            <v-toolbar class="rounded-t-md" flat>
              <v-toolbar-title>Níveis e requisitos de níveis</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="mt-4">
        <v-row justify="end" class="pa-3">
          <v-btn color="primary" class="ma-2" variant="outlined" @click="deletarVersao" data-test="buttonExcluirVersao">Excluir versão</v-btn>
          <v-btn color="primary" class="ma-2" variant="outlined" @click="visualizarEdicao" data-test="buttonAlterarVersao">Alterar versão da
            modalidade</v-btn>
          <v-btn color="primary" class="ma-2" @click="publicarVersao(form.Id)" data-test="buttonPublicarVersao">Publicar nova versão de
            modalidade</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </form>
  </template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import modalidadeService from '../../../services/requires/require';

import log from '@/logger';

type EditingModePageParams = {
  id: string
}
const route = useRoute();
const params = route.params as EditingModePageParams;
const id = params.id;
const ModalidadeObject = new ModalidadeGenericObject({ id: id });
const { post, getById, update } = modalidadeService(ModalidadeObject.modalidadeDetails);
const router = useRouter();
const dialogDelete = ref(false);
const modalidade = ref([]);
const selectedModalidade = ref({});
const requisitos = ref([]);
const hasDraftVersion = ref(false);
const versoes = ref<VersaoModalidadeInterface[]>([]);
const niveis = ref<nivelCompletoVersaoModalidadeInterface[]>([]);
const headersRequisitos = ref([
  { title: 'Tipo', sortable: false, key: 'Tipo' },
  { title: 'Requisito', sortable: false, key: 'Descricao' },
]);



interface nivelCompletoVersaoModalidadeInterface {
    Id: string;
    Sigla: string;
    Valor: string;
    Moeda: string;
}

interface VersaoModalidadeInterface {
  Sigla: string;
  Estado: string;
  [key: string]: any; 
}



const form = reactive({
  Id: '',
  IdEmEdicao: '',
  Sigla: '',
  SiglaEmEdicao: '',
  Nome: '',
  DescricaoEmEdicao: '',
  NumeroResolucao: '',
  ReducaoPorVinculo: null as number | null,
  DataInicioVigencia: '',
  DataFimVigencia: '',
  ModalidadesCompativeis: '',
});

const headersNiveis = ref([
    { title: 'Sigla', sortable: false, key: 'Sigla' },
    { title: 'Valor', sortable: false, key: 'Valor' },
    { title: 'Moeda', sortable: false, key: 'Moeda' },
]);

function formatEstado(estado: string): string {
  const estadosMap: Record<string, string> = {
    ATIVA: 'Ativa',
    EM_EDICAO: 'Em edição',
    INATIVA: 'Inativa',
  };
  return estadosMap[estado] || estado;
}
function navigateToVersion(versao: any) {
  // router.push();
}

function getStateClass(estado: string): Record<string, boolean> {
  return {
    'text-success': estado === 'ATIVA',
    'text-warning': estado === 'EM_EDICAO',
    'text-danger': estado === 'INATIVA',
  };
}

const getPosts = async () => {
  try {
    const response = await getById();
    const modalidadeData = response.value[0];
    modalidadeData.Data = dayjs(modalidadeData.Data).format('YYYY-MM-DD');
    Object.assign(form, modalidadeData);

    selectedModalidade.value = modalidadeData;
    versoes.value = modalidadeData.VersaoModalidadesBolsas;
    niveis.value = modalidadeData.VersaoModalidadesBolsas.flatMap((versao: any) => versao.VersaoNiveis.map((nivel: any) => ({
      Sigla: versao.Sigla,
      Valor: Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nivel.Valor),
      Moeda: nivel.Moeda.Nome,
    })));

    if (modalidadeData.VersaoModalidadesBolsas.length > 0) {
      modalidadeData.VersaoModalidadesBolsas.forEach((element: { Id: string; Estado: string; Descricao: string; Resolucao: { Numero: string; }; Sigla: string; ReducaoPorVinculo: number; DataInicioVigencia: string | number | Date | dayjs.Dayjs | null | undefined; DataFimVigencia: string | number | Date | dayjs.Dayjs | null | undefined; RequisitoBolsas: never[]; }) => {
        if (element.Estado == "EM_EDICAO") {
          form.NumeroResolucao = element.Resolucao.Numero;
          form.SiglaEmEdicao = element.Sigla;
          form.IdEmEdicao = element.Id;
          form.ReducaoPorVinculo = element.ReducaoPorVinculo * 100;
          form.DataInicioVigencia = dayjs(element.DataInicioVigencia).format('YYYY-MM-DD');
          form.DataFimVigencia = element.DataFimVigencia ? dayjs(element.DataFimVigencia).format('YYYY-MM-DD') : '--';
          requisitos.value = element.RequisitoBolsas;
          form.DescricaoEmEdicao = element.Descricao;

          if (modalidadeData.VersaoModalidadesBolsas.length > 0) {
            let countActive = 0;
            let countEditing = 0;

            modalidadeData.VersaoModalidadesBolsas.forEach((element: any) => {
              if (element.Estado === 'ATIVA') {
                countActive++;
              } else if (element.Estado === 'EM_EDICAO') {
                countEditing++;
              }
            });

            hasDraftVersion.value = countActive === 1 && countEditing === 1;
          }
        }
      })
    }
  } catch (error) {
    console.error(error);
  }
};


const onSubmit = async () => {
  try {
    if (params.id) {
    // @ts-ignore
      await update(form);
    } else {
      await post(form);
    }
    alert('Salvo com sucesso');
    router.push({ path: '/modalidade/IndexModalidade' });
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar');
  }
};

const page = ref({ title: 'Visualizar Versão da Modalidade' });

onMounted(async () => {
  await loadModalidade();
  if (params.id) {
    await getPosts();
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

const publicarVersao = async (id: string) => {
  Swal.fire({
    title: "Tem certeza que quer ativar essa modalidade?",
    text: "Essa ação é definitiva e irreversível.",
    showCancelButton: true,
    confirmButtonText: "Publicar",
    confirmButtonColor: "#D3D3D3",
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#F4796B'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const { activate } = modalidadeService('modalidade')
        await activate(id)
        
        Swal.fire({
          title: "Modalidade publicada!",
            icon: "success",
            timer: 1000,
            showConfirmButton: false
        })
        router.push({ path: '/modalidade/IndexModalidade' })
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro ao salvar!",
          confirmButtonColor: "#ffffff",
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  });
};


const visualizarEdicao = () => {
  router.push({ path: `/modalidade/EditModalidade/${form.Id}` });
};

const deletarVersao = async () => {
  try {
    const result = await Swal.fire({
      title: 'Tem certeza que deseja apagar essa versão?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const { remove } = modalidadeService('versaoModalidade');
      await remove(form.IdEmEdicao)
      Swal.fire({
        title: "Deletado com sucesso!",
        icon: "success",
        confirmButtonColor: "#7066E0",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        router.push({ path: '/modalidade/IndexModalidade' });
      });
    }
  } catch (error) {
    console.error(error);
    
    Swal.fire({
      text: "Não foi possível apagar a modalidade",
      confirmButtonColor: "#7066E0"
    });
  } finally {
    dialogDelete.value = false;
  }
};





const loadModalidade = async () => {
  try {
    modalidade.value = await getById();
  } catch (error) {
    console.error('Erro ao carregar modalidade:', error);
  }
};
</script>