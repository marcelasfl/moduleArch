<script async lang="ts" setup>
import AlocacaoBolsistaController from '@/dashboard/controller/AlocacaoBolsistaController';
import BolsistaPorProjetoController from '@/dashboard/controller/BolsistaPorProjetoController';
import PessoaController from '@/dashboard/controller/PessoaController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import BolsistaProjeto from '@/dashboard/model/BolsistaPorProjeto';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import type { IPessoa } from '@/dashboard/model/Pessoa';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { storeToRefs } from 'pinia';
import { ref, watch } from "vue";
import { VTextField } from 'vuetify/lib/components/index.mjs';
dayjs.extend(utc)

const bolsista = ref<IPessoa>(
    {
        Id: "", 
        Nome: "",
        CPF: "",
        Email: "",
        DataNascimento: ""
    }
);

// const alocacoesBolsistas = ref<AlocacaoBolsista[]>([]);
// const filteredAlocacaoBolsista = ref<AlocacaoBolsista[]>([]);
const alocacoesBolsistas = ref<BolsistaProjeto[]>([]);
const filteredAlocacaoBolsista = ref<BolsistaProjeto[]>([]);
const bolsistaClicado = ref<BolsistaProjeto>(
    {
        id: "",
        nome: "",
        status: 0,
        siglaBolsa: "",
        cotasPagas: 0,
        cotasAPagar: 0,
        valorBolsa: 0,
        valorAPagar: 0,
        alocacaoBolsistaProjetoId: "",
        alocacaoBolsistaPessoaId: "",
        coordenadorAtual: false
    }
);
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const dialogBolsista = ref(false)
const alocacaoBolsistaStore = new AlocacaoBolsistaController();
const bolsistaPorProjetoStore = new BolsistaPorProjetoController();
const pessoaStore = new PessoaController();

const headersBolsista = ref([
    { title: 'Bolsista', align: 'start', sortable: true, key: 'nome'},
    { title: 'Status', key: 'status', sortable: false, align: 'center' },
    { title: 'Sigla', key: 'siglaBolsa', sortable: true }, 
    { title: 'Cotas pagas', key: 'cotasPagas', sortable: true },
    { title: 'Cotas a pagar', key: 'cotasAPagar', sortable: true },
    { title: 'Valor da bolsa', key: 'valorBolsa', sortable: true },
    { title: 'Ações', key: 'actions', sortable: false }
]);
const select = ref(["Ativas"])
const items = ref(["Todas", "Ativas", "Canceladas", "Suspensas", "Em avaliação", "Finalizadas", "Em edição", "Documentação pendente", "Pendente de avaliação", "Aguardando aceites"]);
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


watch(buscarSelectStore.projeto, () => {
    if (buscarSelectStore.projeto.value) {
        getPosts();
    } else {
        alocacoesBolsistas.value = [];
        filteredAlocacaoBolsista.value = [];
    }
})
// watch(projetoSelectStore.selected, () => {
//     if (projetoSelectStore.selected.value) {
//         getPosts();
//     } else {
//         alocacoesBolsistas.value = [];
//         filteredAlocacaoBolsista.value = [];
//     }
//     // if (projetoSelectStore.selected.value) {
//     //     updateSelect(projetoSelectStore.selected.value);
//     // }
// });

const odataCount = ref()
const getPosts = async () => {
    try {
        const { bolsistas, odata } = await bolsistaPorProjetoStore.getAll(`alocacaoBolsistaProjetoId eq ${projetoSelectStore.selected.value}`);
        
        alocacoesBolsistas.value = bolsistas;
        odataCount.value = bolsistas.length;
        if (select.value.includes("Todas")) {
            filteredAlocacaoBolsista.value = alocacoesBolsistas.value;
        } else {
            const selected = select.value.map((item) => {
                return item === "Ativas" ? 5 
                : item === "Canceladas" ? 7 
                : item === "Suspensas" ? 6 
                : item === "Em avaliação" ? 4 
                : item === "Finalizadas" ? 8 
                : item == "Em edição" ? 0
                : item == "Documentação pendente" ? 1
                : item == "Aguardando aceites" ? 2
                : item == "Pendente de avaliação" ? 3
                : "";
            }) as number[]
            filteredAlocacaoBolsista.value = alocacoesBolsistas.value.filter((item) => {
                if (item.status) {
                    return selected.includes(item.status);
                }
                    return false;
                }
            );
        }
        

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

const getPostPaginacao = async () => {
  try{
    let filter = ""
    let i = 1;
    if (select.value.length !== 1 || !select.value.includes("Todas")) {
        select.value = select.value.filter((item) => item !== "Todas");
        select.value.forEach((item) => {
            item = item === "Ativas" ? "ATIVA" : item === "Canceladas" ? "CANCELADA" : item === "Suspensas" ? "SUSPENSA" : item === "Em avaliação" ? "EM_AVALIACAO" : item === "Finalizadas" ? "FINALIZADA" : "";
            if (i == select.value.length) {
                filter += ` Status eq '${item}'`
            } else {
                filter += ` Status eq '${item}' or`
            }
            i++;
        });
    }
    filteredAlocacaoBolsista.value = await alocacaoBolsistaStore.paginacao({ skip: filteredAlocacaoBolsista.value.length }, filter);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}

const pageTable = ref()
const itemsPerPage = ref(10)
const fetchData = () => {
  if ((itemsPerPage.value * (pageTable.value + 1)) > filteredAlocacaoBolsista.value.length && filteredAlocacaoBolsista.value.length < odataCount.value) {
    getPostPaginacao();
  }
}

const getOdataCount = async () => {
  try{
    odataCount.value = await alocacaoBolsistaStore.count();
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}
const getPessoa = async (id: string) => {
    try {
        bolsista.value = await pessoaStore.getById(id);
        if (bolsista.value.DataNascimento){
            bolsista.value.DataNascimento = dayjs(bolsista.value.DataNascimento).utc().format('YYYY-MM-DD')
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}


const updateSelect = (newValues: string[]) => {
    if (newValues.length === 0) {
        select.value = ["Ativas"]; // Força a seleção de "Ativas" se nenhuma opção estiver marcada
    } else if (newValues.includes("Todas")) {
        select.value = ["Todas"];
    } else {
        select.value = newValues;
    }
    updateTable(newValues);
};

const updateTable = (newValues: any) => {
    if (newValues.includes("Todas")) {
        filteredAlocacaoBolsista.value = alocacoesBolsistas.value;
    } else {
        // Filtra os itens com base nos valores selecionados
        filteredAlocacaoBolsista.value = alocacoesBolsistas.value.filter((item) =>
            newValues.includes(
                getStatus(item.status)
            )
        );
    }
}
watch(select, updateTable)

function abrirDialogBolsista(bolsista: BolsistaProjeto) {
    bolsistaClicado.value = bolsista;
    getPessoa(bolsista.alocacaoBolsistaPessoaId);
    dialogBolsista.value = true;
}

const getStatus = (status: number) => {
    switch (status) {
        case 0:
            return "Em edição";
        case 1:
            return "Documentação pendente";
        case 2:
            return "Aguardando aceites";
        case 3:
            return "Pendente de avaliação";
        case 4:
            return "Em avaliação";
        case 5:
            return "Ativas";
        case 6:
            return "Suspensas";
        case 7:
            return "Canceladas";
        case 8:
            return "Finalizadas";
        default:
            return "";
    }
}

</script>

<template>
    <VCard elevation="10">
        <v-card-text>
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4">Bolsistas no projeto</h2>
                </div>
                <v-spacer></v-spacer>
                <div class="ml-auto">
                    <v-select 
                        v-model="select" 
                        :items="items" 
                        variant="outlined" 
                        dense 
                        hide-details
                        multiple 
                        @update:modelValue="updateSelect">
                    </v-select>
                </div>
            </div>
            <!--:sort-by="[{ key: 'Bolsista', order: 'asc' }]"-->
            <v-data-table class="month-table mt-5 mb-0" :headers="headersBolsista" :items="filteredAlocacaoBolsista"
            :sort-by="[{ key: 'nome', order: 'asc' }]" :items-per-page-options="[5, 10, 25]" v-model:page="pageTable"
            v-model:items-per-page="itemsPerPage"> 
            <!-- @update:page="fetchData" -->
                <template v-slot:item.nome="{ item }">
                    <a href="#" @click.prevent="abrirDialogBolsista(item)" style="color: #2B3A8A;">
                        {{ item.nome }}
                    </a>
                    <v-chip class="ma-2" size="small" v-if="item.coordenadorAtual" color="#295FD5" label>Coordenador</v-chip>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip class="ma-2" size="small" v-if="item.status==5" color="#6FC487" label>ATIVA</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==7" color="#BD3B3B" label>CANCELADA</v-chip> 
                    <v-chip class="ma-2" size="small" v-else-if="item.status==6" color="#2B3A8A" label>SUSPENSA</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==4" color="#7C85B8" label>EM AVALIAÇÃO</v-chip> 
                    <v-chip class="ma-2" size="small" v-else-if="item.status==8" color="#727793" label>FINALIZADA</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==3" color="#7C85B8" label>PENDENTE DE AVALIAÇÃO</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==1" color="#7C85B8" label>DOCUMENTAÇÃO PENDENTE</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==2" color="#ADBC13" label>AGUARDANDO ACEITES</v-chip>
                    <v-chip class="ma-2" size="small" v-else-if="item.status==0" color="#7C85B8" label>EM EDIÇÃO</v-chip>
                </template>
                <template v-slot:item.siglaBolsa="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ item.siglaBolsa }}</h4>
                </template>
                <template v-slot:item.cotasPagas="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ item.cotasPagas }}</h4>
                </template>
                <template v-slot:item.cotasAPagar="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ item.cotasAPagar }}</h4>
                </template>
                <template v-slot:item.valorBolsa="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ formatCurrency (item.valorBolsa) }} </h4>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" color="primary" dark @click="abrirDialogBolsista(item)"
                        >mdi-eye</v-icon
                    >
                </template>
                <template v-slot:no-data>
                    <v-label>Não há dados disponíveis.</v-label>
                </template>
            </v-data-table>
        </v-card-text>
    </VCard>
    <v-dialog v-model="dialogBolsista" max-width="500">
        <v-card>
            <v-card-title class="pa-4">
                <span class="text-h3" v-if="bolsistaClicado.coordenadorAtual">Detalhes do Coordenador</span>
                <span class="text-h3" v-else>Detalhes do Bolsista</span>
            </v-card-title>
            <v-card-text>
                <v-container class="px-0">
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Nome completo</v-label>
                            <VTextField type="text" hide-details disabled>{{ bolsista.Nome }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <v-label class="font-weight-medium mb-2">CPF</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ bolsista.CPF }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">E-mail</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ bolsista.Email }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" v-if="bolsista.DataNascimento">
                            <v-label class="font-weight-medium mb-2">Data de Nascimento</v-label><br>
                            <VTextField type="date" hide-details disabled>{{ bolsista.DataNascimento }}</VTextField>
                            <!-- <v-label hide-details maxlength="15">{{  dayjs(bolsista.DataNascimento).utc().format('DD/MM/YYYY')}}</v-label> -->
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Tempo de alocação no projeto atual</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ bolsistaClicado.cotasAPagar + bolsistaClicado.cotasPagas }} meses</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Tipo da bolsa</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ bolsistaClicado.siglaBolsa }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Valor da bolsa</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ formatCurrency (bolsistaClicado.valorBolsa) }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Status de alocação</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ getStatus(bolsistaClicado.status) }}</VTextField>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="font-weight-medium mb-2">Cotas remanescentes</v-label><br>
                            <VTextField type="text" hide-details disabled>{{ bolsistaClicado.cotasPagas }}/{{ bolsistaClicado.cotasAPagar + bolsistaClicado.cotasPagas }}</VTextField>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>