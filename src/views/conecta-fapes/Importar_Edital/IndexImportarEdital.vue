<template>
    <BaseBreadcrumb :title="page.title" />
    <div class="p-8">
        <p class="text-gray-600 mb-6">Editais do SIGFAPES disponíveis para importar para o CONECTAFAPES</p>

        <div class="mb-4">
            <h2 class="text-xl font-semibold mb-4">Editais não sincronizados</h2>
            <div class="flex items-center">
                <v-col cols="8" class="d-flex justify-start">
                    <v-col cols="6" class="d-flex">
                        <v-text-field v-if="!loading" v-model="searchUnsynced" label="Pesquisar Edital" clearable
                            class="flex-grow mr-2" data-test="inputPesquisarEdital"></v-text-field>
                        <v-skeleton-loader v-else class="flex-grow mr-2" type="text"></v-skeleton-loader>
                        <v-btn color="primary" variant="flat" @click="filterEditais('unsynced')" data-test="buttonBuscarEditais">Buscar</v-btn>
                    </v-col>
                </v-col>
            </div>

            <v-data-table v-if="!loading" class="border rounded-md" :headers="headersUnsynced" :items="unsyncedEditais"
                :items-per-page-options="[5, 10, 25]" v-model:page="pageTableUnsynced"
                v-model:items-per-page="itemsPerPageUnsynced">
                <template v-slot:no-data>
                    <v-row class="text-center">
                        <v-col>
                            <p>Sem dados!</p>
                        </v-col>
                    </v-row>
                </template>
                <template v-slot:item.select="{ item }">
                    <v-checkbox :v-model="selectedEditais" @change="toggleSelect(item)" data-test="checkboxSelectEdital"></v-checkbox>
                </template>

                <template v-slot:item.DataCriacao="{ item }">
                    <span>{{ formatDate(item.DataCriacao) }}</span>
                </template>
                <template v-slot:item.edital="{ item }">
                    <div class="d-flex align-center">
                        <span>{{ item.Nome }}</span>
                    </div>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon color="primary" size="small" class="mdi mdi-swap-horizontal" @click="syncEdital(item)" data-test="iconSyncEdital"></v-icon>
                </template>
            </v-data-table>
            <v-skeleton-loader v-else class="border rounded-md" :type="['table']"
                :loading="loading"></v-skeleton-loader>

            <v-col cols="4" class="d-flex align-start">
                <v-btn class="custom-width" color="primary" variant="flat" @click="showEditaisModal"
                    :disabled="!selectedEditais.length" data-test="buttonDefinirEditais">Definir editais</v-btn>
            </v-col>
        </div>

        <div>
            <h2 class="text-xl font-semibold">Editais a sincronizar</h2>
            <div class="flex items-center">
                <v-col cols="8" class="d-flex justify-start">
                    <v-col cols="8" class="d-flex">
                        <v-text-field v-if="!loading" v-model="searchSynced" label="Pesquisar Edital" clearable
                            class="flex-grow mr-4" data-test="inputPesquisarEditalSynced"></v-text-field>
                        <v-skeleton-loader v-else class="flex-grow mr-4" type="text"></v-skeleton-loader>
                        <v-btn color="primary" variant="flat" @click="filterEditais('synced')" data-test="buttonBuscarEditaisSynced">Buscar</v-btn>
                    </v-col>
                </v-col>
            </div>
            <v-data-table v-if="!loading" class="border rounded-md" :headers="headersSynced" :items="syncedEditais"
                :items-per-page-options="[5, 10, 25]" v-model:page="pageTableSynced"
                v-model:items-per-page="itemsPerPageSynced">
                <template v-slot:no-data>
                    <v-row class="text-center">
                        <v-col>
                            <p>Sem dados!</p>
                        </v-col>
                    </v-row>
                </template>
                <template v-slot:item.StatusImportacao="{ item }">
                    <span>{{ mapStatus(item.StatusImportacao) }}</span>
                </template>
                <template v-slot:item.AreaTecnica="{ item }">
                    <span v-if="item.AreaTecnica == null">-</span>
                    <span v-else>{{ item.AreaTecnica.Nome }}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon color="primary" size="small" class="me-2" @click="visualizaEdital(item.Id)" data-test="iconVisualizaEdital">mdi-eye</v-icon>
                </template>
            </v-data-table>
            <v-skeleton-loader v-else class="border rounded-md" :type="['table']"
                :loading="loading"></v-skeleton-loader>
        </div>
    </div>

    <v-dialog v-model="modelEditais" max-width="600px">
        <v-card>
            <v-card-title class="text-h4"> Aplicar Área Técnica e importar editais em massa </v-card-title>
            <v-card-text>
                <v-label class="font-weight-medium mb-4 custom-titles"> Para os editais listados abaixo, informe a Área
                    Técnica: </v-label>
                <v-list>
                    <v-list-item-group v-if="selectedEditais.length > 0">
                        <v-list-item v-for="edital in selectedEditais" :key="edital.Id">
                            <v-list-item-content>
                                <v-list-item-title>{{ edital.Nome }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item v-else>
                        <v-list-item-content>
                            <v-list-item-title>Nenhum edital selecionado.</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-label class="font-weight-medium mb-4 custom-titles">
                    <strong>Área Técnica * </strong>
                </v-label>
                <v-select v-model="selectedArea" :items="areaTecnicaSelect" item-title="Nome" item-value="Id"
                    placeholder="Selecione a Área Técnica" data-test="selectAreaTecnica"></v-select>
                <p class="mt-4">
                    Estes editais serão adicionado à lista de sincronização, e
                    <strong>essa ação não pode ser desfeita</strong>. Deseja continuar?
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="modelEditais = false" data-test="buttonCancelar">Cancelar</v-btn>
                <v-btn color="primary" variant="flat" @click="confirmSync" data-test="buttonDefinirSincronizacao">Definir para sincronização</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showSyncModal" max-width="600px">
        <v-card>
            <v-card-title class="text-h4"> Sincronizar edital? </v-card-title>
            <v-card-text>
                <v-label class="font-weight-medium mb-4 custom-titles">
                    Informe a Área Técnica do edital para iniciar a sincronização.
                </v-label>

                <v-label class="font-weight-medium mb-4 custom-titles"> <strong>Área Técnica * </strong></v-label>
                <v-select v-model="selectedArea" :items="areaTecnicaSelect" item-title="Nome" item-value="Id"
                    placeholder="Selecione a Área Técnica" data-test="selectAreaTecnicaSync"></v-select>
                <p class="mt-4">
                    Este edital será adicionado à lista de sincronização, e
                    <strong>essa ação não pode ser desfeita</strong>. Deseja continuar?
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showSyncModal = false" data-test="buttonCancelarSync">Cancelar</v-btn>
                <v-btn color="primary" variant="flat" @click="confirmSyncs" data-test="buttonDefinirSincronizacaoSync">Definir para sincronização</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import AreaTecnicaGenericObject from '@/services/requires/objects/importaredital/AreaTecnica';
import EditalGenericObject from '@/services/requires/objects/importaredital/Edital';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import services from '../../../services/requires/require';

export default {
    name: 'DefinirEditais',
    components: {
        BaseBreadcrumb
    },
    setup() {
        const page = ref({ title: 'Definir editais a sincronizar' });
        const searchUnsynced = ref('');
        const searchSynced = ref('');
        const router = useRouter();
        const pageTableUnsynced = ref(1);
        const itemsPerPageUnsynced = ref(10);
        const pageTableSynced = ref(1);
        const itemsPerPageSynced = ref(10);
        const selectAll = ref(false);
        const unsyncedEditaisOriginal = ref([]);
        const syncedEditaisOriginal = ref([]);
        const showSyncModal = ref(false);
        const modelEditais = ref(false);
        const selectedEdital = ref<any>(null);
        const loading = ref(true);
        const selectedEditais = ref<{ Id: string; Nome: string }[]>([]);
        const selectedArea = ref<string | null>(null);
        const areaTecnicaSelect = ref<{ Nome: string; Id: string }[]>([
            { Nome: "Desenvolvimento de Software", Id: "1" },
            { Nome: "Infraestrutura de TI", Id: "2" },
            { Nome: "Segurança da Informação", Id: "3" },
        ]);
        const unsyncedEditais = ref([

            { Id: '1', Nome: 'Edital de Pesquisa 2024', DataCriacao: '2023-06-01' },
            { Id: '2', Nome: 'Edital de Inovação Tecnológica', DataCriacao: '2023-07-15' },
            { Id: '3', Nome: 'Edital de Empreendedorismo', DataCriacao: '2023-08-20' },
            { Id: '4', Nome: 'Edital de Sustentabilidade', DataCriacao: '2023-09-10' },
            { Id: '5', Nome: 'Edital de Desenvolvimento Social', DataCriacao: '2023-10-05' }
        ]);
        const syncedEditais = ref([]);
        const EditalAreaObject = new EditalGenericObject({});
        const EditalObject = new EditalGenericObject({});
        const { list: listEditais } = services(EditalObject.editalExpand);
        const { getById } = services(EditalAreaObject.editalAreaTecnica);
        const { update } = services(EditalObject.importar);
        const AreaTecnicaObject = new AreaTecnicaGenericObject({});
        const { list: listAreaTecnica } = services(AreaTecnicaObject.entity);

        const headersUnsynced = [
            { key: 'select', align: 'center', sortable: false },
            { key: 'Nome', title: 'Edital', align: 'start' },
            { key: 'DataCriacao', title: 'Data de lançamento' },
            { key: 'actions', title: 'Ações', sortable: false }
        ];

        const headersSynced = [
            { key: 'Nome', title: 'Edital', align: 'start' },
            { key: 'StatusImportacao', title: 'Status' },
            {
                key: 'DataUltimaSincronizacao',
                title: 'Última sincronização',
                value: (item: any) => formatDate(item.DataUltimaSincronizacao)
            },
            { key: 'AreaTecnica', title: 'Área técnica' },
            { key: 'actions', title: 'Ações', sortable: false }
        ];

        const mapStatus = (status: string) => {
            const statusMap: { [key: string]: string } = {
                NAOIMPORTAR: 'Não importado',
                AIMPORTAR: 'A importar',
                IMPORTADO: 'Importado'
            };
            return statusMap[status] || 'Status desconhecido';
        };

        const formatDate = (date: any) => {
            const formattedDate = dayjs(date).format('DD/MM/YYYY');
            return formattedDate === 'Invalid Date' ? 'Não informada' : formattedDate;
        };

        const applyFilterUnsynced = () => {
            if (searchUnsynced.value) {
                unsyncedEditais.value = unsyncedEditaisOriginal.value.filter((edital: any) =>
                    edital.Nome ? edital.Nome.toLowerCase().includes(searchUnsynced.value.toLowerCase()) : false
                );
            } else {
                unsyncedEditais.value = [...unsyncedEditaisOriginal.value];
            }
        };

        const applyFilterSynced = () => {
            if (searchSynced.value) {
                syncedEditais.value = syncedEditaisOriginal.value.filter((edital: any) =>
                    edital.Nome ? edital.Nome.toLowerCase().includes(searchSynced.value.toLowerCase()) : false
                );
            } else {
                syncedEditais.value = [...syncedEditaisOriginal.value];
            }
        };

        const filterEditais = async (type: string) => {
            let filter = '';
            if (type === 'unsynced') {
                applyFilterUnsynced();
            } else if (type === 'synced') {
                applyFilterSynced();
            }
        };

        const fetchEditais = async (filter: string, type: string) => {
            loading.value = true;
            try {
                const params = {
                    $filter: filter,
                    $top: type === 'unsynced' ? itemsPerPageUnsynced.value : itemsPerPageSynced.value,
                    $skip:
                        type === 'unsynced'
                            ? (pageTableUnsynced.value - 1) * itemsPerPageUnsynced.value
                            : (pageTableSynced.value - 1) * itemsPerPageSynced.value
                };
                const response = await listEditais();
                if (type === 'unsynced') {
                    unsyncedEditais.value = response.value;
                } else {
                    syncedEditais.value = response.value;
                }
            } catch (error) {
                console.error('Erro ao buscar editais', error);
            } finally {
                loading.value = false;
            }
        };

        const toggleSelectAll = () => {
            selectAll.value = !selectAll.value;
            unsyncedEditais.value.forEach((edital: any) => {
                edital.selected = selectAll.value;
            });
            updateSelectedEditais();
        };

        const toggleSelect = (item: any) => {
            item.selected = !item.selected;
            updateSelectedEditais();
        };

        const updateSelectedEditais = () => {
            selectedEditais.value = unsyncedEditais.value.filter((edital: any) => edital.selected);
        };

        const showEditaisModal = () => {
            modelEditais.value = true;
        };

        const syncEdital = (item: any) => {
            
            selectedEdital.value = item;
            
            showSyncModal.value = true;
        };

        const confirmSync = async () => {
            try {
                if (selectedEditais.value.length > 0 && selectedArea.value) {
                    const payload = {
                        editaisIds: selectedEditais.value.map((edital) => edital.Id),
                        areaTecnicaId: selectedArea.value
                    };

                    

                    const response = await update(payload);

                    
                    modelEditais.value = false;
                    selectedArea.value = null;
                    Swal.fire({
                        title: 'Sincronizado com sucesso!',
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    await getPostsEditais();
                } else {
                    console.error('Área Técnica ou Edital não selecionado');
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Selecione um edital e uma área técnica antes de sincronizar',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error('Erro ao sincronizar', error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao sincronizar',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        };

        const confirmSyncs = async () => {
            try {
                if (selectedEditais.value && selectedArea.value) {
                    const payload = {
                        editaisIds: [selectedEdital.value.Id],
                        areaTecnicaId: selectedArea.value
                    };

                    

                    const response = await update(payload);

                    
                    showSyncModal.value = false;
                    selectedArea.value = null;
                    Swal.fire({
                        icon: 'success',
                        title: 'Sincronização bem-sucedida!',
                        text: 'Os editais foram sincronizados com sucesso.',
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        getPostsEditais();
                    });
                } else {
                    console.error('Área Técnica ou Edital não selecionado');
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Selecione um edital e uma área técnica antes de sincronizar.',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error('Erro ao sincronizar', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao sincronizar os editais.',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        };

        const getPostsAreaTecnica = async () => {
            try {
                const data = await listAreaTecnica();
                areaTecnicaSelect.value = data.value;
            } catch (error) {
                console.error('Erro ao buscar áreas técnicas:', error);
            }
        };

        const getPostsEditaisAreaTecnica = async () => {
            try {
                const response = await getById();
                const data = response.value.map((edital: any) => ({
                    ...edital,
                    areaTecnicaSelect: edital.AreaTecnica?.Nome || 'Sem área técnica'
                }));
                syncedEditais.value = data;
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao buscar editais',
                    text: error.message
                });
            }
        };

        const getPostsEditais = async () => {
            loading.value = true;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                const data = await listEditais();
                unsyncedEditais.value = data.value.filter((edital: any) => edital.StatusImportacao === 'NAOIMPORTAR');
                syncedEditais.value = data.value.filter(
                    (edital: any) => edital.StatusImportacao === 'IMPORTADO' || edital.StatusImportacao === 'AIMPORTAR'
                );
            } catch (error) {
                console.error('Erro ao buscar editais:', error);
            } finally {
                loading.value = false;
            }
        };

        const visualizaEdital = (id: string) => {
            router.push({ path: `/importaredital/DetalhesEdital/${id}` });
        };

        //quando acabar de testar, voltar com esse onMounted
        // onMounted(() => {
        //     getPostsEditais();
        //     getPostsEditaisAreaTecnica();
        //     getPostsAreaTecnica();
        //     filterEditais('unsynced');
        //     filterEditais('synced');
        // });

        onMounted(async () => {
            try {
                // Carregar dados da API
                const fetchedUnsyncedEditais = await listEditais();
                const fetchedAreaTecnica = await listAreaTecnica();

                // Checar se a resposta da API contém dados para sobrescrever os dados fake
                if (fetchedUnsyncedEditais && fetchedUnsyncedEditais.length > 0) {
                    unsyncedEditais.value = fetchedUnsyncedEditais;
                }
                if (fetchedAreaTecnica && fetchedAreaTecnica.length > 0) {
                    areaTecnicaSelect.value = fetchedAreaTecnica;
                }

                loading.value = false;
            } catch (error) {
                console.error("Erro ao carregar os dados da API:", error);
                loading.value = false;
            }
        });


        return {
            page,
            searchUnsynced,
            searchSynced,
            headersUnsynced,
            updateSelectedEditais,
            unsyncedEditais,
            visualizaEdital,
            pageTableUnsynced,
            itemsPerPageUnsynced,
            selectAll,
            toggleSelectAll,
            toggleSelect,
            headersSynced,
            syncedEditais,
            pageTableSynced,
            itemsPerPageSynced,
            fetchEditais,
            showSyncModal,
            modelEditais,
            syncEdital,
            mapStatus,
            selectedEdital,
            confirmSync,
            confirmSyncs,
            selectedArea,
            areaTecnicaSelect,
            getPostsEditaisAreaTecnica,
            getPostsAreaTecnica,
            formatDate,
            showEditaisModal,
            selectedEditais,
            filterEditais,
            loading
        };
    }
};
</script>
