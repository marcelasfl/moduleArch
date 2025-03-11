<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    <UiParentCard title="Informações da modalidade" class="mb-4">
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
                    >
                    </v-combobox>
                    <v-label class="font-weight-small mt-1 custom-titles-hint"
                        >Resolução que define a modalidade. Não encontrou a resolução?
                        <a class="ml-1 link-href" @click="incluirResolucao" data-test="linkIncluirResolucao"> Cadastrar</a></v-label
                    >
                </v-col>
                <v-col cols="4">
                    <v-label class="font-weight-medium mb-2 custom-titles">Sigla *</v-label>
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
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Nome da modalidade *</v-label>
                    <VTextField
                        type="text"
                        placeholder="Digite o nome da modalidade da bolsa"
                        hide-details
                        required
                        v-model="formModalidade.Nome"
                        :disabled="disabled"
                        data-test="inputModalidadeNome"
                    ></VTextField>
                    <v-label class="font-weight-small mt-1 custom-titles-hint">Nome completo da modalidade</v-label>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="6">
                            <v-label class="font-weight-medium mb-2 custom-titles">Nome da versão *</v-label>
                            <VTextField
                                type="text"
                                placeholder="Ex: BPIG"
                                hide-details
                                required
                                v-model="formVersaoModalidade.Sigla"
                                max-length="20"
                                data-test="inputVersaoNome"
                            ></VTextField>
                        </v-col>
                        <v-col cols="6">
                            <v-label class="font-weight-medium mb-2 custom-titles">Status desta versão</v-label>
                            <VTextField
                                type="text"
                                placeholder="Ex: BPIG"
                                hide-details
                                required
                                v-model="formVersaoModalidade.Estado"
                                :disabled="true"
                                max-length="20"
                                data-test="inputVersaoStatus"
                            ></VTextField>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-2 custom-titles">Descrição *</v-label>
                    <VTextarea
                        auto-grow
                        placeholder="Escreva os objetivos da modalidade em até 500 caracteres"
                        rows="2"
                        color="primary"
                        row-height="25"
                        shaped
                        hide-details
                        required
                        v-model="formVersaoModalidade.Descricao"
                        data-test="textareaVersaoDescricao"
                    ></VTextarea>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="6" class="pt-0">
                            <v-checkbox
                                density="compact"
                                hide-details
                                color="primary"
                                label="Redução em caso de vínculo empregatício *"
                                v-model="haReducaoPorVinculo"
                                data-test="checkboxReducaoVinculo"
                            ></v-checkbox>
                            <VTextField
                                type="number"
                                placeholder="Ex: 60"
                                hide-details
                                v-model="formVersaoModalidade.ReducaoPorVinculo"
                                :disabled="!haReducaoPorVinculo"
                                min="0"
                                max="100"
                                suffix="%"
                                data-test="inputPercentualReducao"
                            ></VTextField>
                            <v-label class="font-weight-small mt-1 custom-titles-hint"
                                >Percentual do valor da bolsa a ser pago em caso de vínculo empregatício.</v-label
                            >
                        </v-col>
                        <v-col cols="6">
                            <v-label class="font-weight-medium mb-2">Data de vigência *</v-label>
                            <VTextField
                                placeholder="dd/mm/aaaa"
                                type="date"
                                hide-details
                                required
                                v-model="formVersaoModalidade.DataInicioVigencia"
                                :min="minDate"
                                :max="maxDate"
                                data-test="inputDataVigencia"
                            ></VTextField>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12">
                    <v-select
                        :items="modalidadesSelect"
                        item-title="sigla"
                        item-value="id"
                        hide-details
                        label="Selecione as modalidades compatíveis"
                        multiple
                        v-model="formVersaoModalidade.ModalidadeBolsaCompativeis"
                        data-test="selectModalidadesCompativeis"
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
                        <v-btn :color="botaoColorRequisito" variant="tonal" dark @click="abrirDialogCriarRequisito" data-test="buttonAdicionarRequisito">Adicionar requisito</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="pa-4">
                            <span class="text-h5">Requisito de modalidade</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="px-0">
                                <v-row>
                                    <v-col cols="12">
                                        <v-label class="font-weight-medium mb-2">Tipo *</v-label>
                                        <v-select
                                            :items="tiposRequisitos"
                                            item-title="tipo"
                                            item-value="value"
                                            placeholder="Selecione um tipo de requisito"
                                            hide-details
                                            required
                                            v-model="formRequisitoModalidade.Tipo"
                                            data-test="selectTipoRequisito"
                                        >
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-label class="font-weight-medium mb-2">Descrição *</v-label>
                                        <VTextarea
                                            auto-grow
                                            placeholder="Escreva a descrição do requisito (até 500 caracteres)."
                                            rows="2"
                                            color="primary"
                                            row-height="25"
                                            shaped
                                            hide-details
                                            required
                                            v-model="formRequisitoModalidade.Descricao"
                                            @input="atualizaContadorDescricaoRequisitoModalidade"
                                            data-test="textareaDescricaoRequisito"
                                        ></VTextarea>
                                        <v-label
                                            class="font-weight-small mt-1"
                                            :class="{ 'text-danger': contadorDescricaoRequisitoModalidade > 500 }"
                                        >
                                            {{ contadorDescricaoRequisitoModalidade }}/500 caracteres
                                        </v-label>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="outlined" dark @click="closeRequisito" data-test="buttonCancelarRequisito"> Cancelar </v-btn>
                            <v-btn color="primary" variant="flat" dark @click="onSubmitRequisito(formRequisitoModalidade.Id)" data-test="buttonSalvarRequisito">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDeleteRequisito" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5 text-center py-6">Você tem certeza que deseja deletar esse requisito?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="outlined" dark @click="closeDeleteRequisito" data-test="buttonCancelarDeletarRequisito">Cancelar</v-btn>
                            <v-btn color="primary" variant="flat" dark @click="deleteItemConfirmRequisito" data-test="buttonDeletarRequisito">Deletar</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }: { item: ItemTabelaInterface }">
            <v-icon color="primary" size="small" class="me-2" @click="editItemRequisito(item.Id)" data-test="iconEditarRequisito"> mdi-pencil </v-icon>
            <v-icon color="error" size="small" @click="confirmDeleteItemRequisito(item.Id)" data-test="iconDeletarRequisito"> mdi-delete </v-icon>
        </template>
        <template v-slot:item.Descricao="{ item }: { item: ItemTabelaInterface }">
            <div class="descricao-cell">{{ item.Descricao }}</div>
        </template>
        <template v-slot:no-data>
            <v-label>Sem dados!</v-label>
        </template>
    </v-data-table>

    <v-data-table data-test="table-niveis" class="border rounded-md mt-4" :headers="headersNiveis" :items="niveis">
        <template v-slot:top>
            <v-toolbar class="rounded-t-md" flat>
                <v-toolbar-title>Níveis e requisitos de níveis</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogNiveis" max-width="1000px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :color="botaoColorNivel" variant="tonal" dark @click="abrirDialogCriarNivel" data-test="buttonAdicionarNivel">Adicionar nível</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="pa-4">
                            <span class="text-h5">Nível e requisito de nível</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="px-0">
                                <v-row>
                                    <v-col cols="12">
                                        <v-label class="font-weight-medium mb-2 custom-titles">Sigla do nível *</v-label>
                                        <VTextField
                                            type="text"
                                            hide-details
                                            required
                                            placeholder="Digite a sigla do nível da bolsa (até 10 caracteres)."
                                            v-model="formNivel.SiglaNivel"
                                            :disabled="siglaNivelRequired"
                                            maxlength="10"
                                            data-test="inputSiglaNivel"
                                            @input="atualizarContadorSiglaNivelBolsa"
                                        >
                                            <template v-slot:prepend>
                                                <span>{{ formModalidade.Sigla }}-</span>
                                            </template>
                                        </VTextField>
                                        <v-label
                                            class="font-weight-small mt-1 ml-15"
                                            :class="{ 'text-danger': contadorSiglaNivelBolsa > 10 }"
                                        >
                                            {{ contadorSiglaNivelBolsa }}/10 caracteres
                                        </v-label>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <v-label class="font-weight-medium mb-2 custom-titles">Moeda *</v-label>
                                        <v-select
                                            :items="moedas"
                                            item-title="Nome"
                                            item-value="Id"
                                            placeholder="Selecione a moeda do nível da bolsa"
                                            v-model="formVersaoNivel.MoedaId"
                                            data-test="selectMoedaNivel"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" class="pt-0">
                                        <v-label class="font-weight-medium mb-2 custom-titles">Valor *</v-label>
                                        <VTextField
                                            type="number"
                                            placeholder="Digite o valor do nível da bolsa"
                                            hide-details
                                            required
                                            v-model="formVersaoNivel.Valor"
                                            data-test="inputValorNivel"
                                        ></VTextField> {{ formatMoney(formVersaoNivel.Valor) }}
                                        <v-label 
                                            v-if="(formVersaoNivel.Valor! < 0.01 || formVersaoNivel.Valor! > 99999999) && formVersaoNivel.Valor" 
                                            class="font-weight-small mt-1 text-danger"
                                        >O valor deve ser maior que 0,01 e menor que 99.999.999,00
                                        </v-label>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="text-end">
                                        <v-btn color="primary" variant="flat" class="" dark @click="onSubmitNivel()" data-test="buttonSalvarNivel">Salvar</v-btn>
                                    </v-col>
                                </v-row>
                                <v-data-table class="border rounded-md mt-4" :headers="headersRequisitos" :items="requisitosNivel">
                                    <template v-slot:top>
                                        <v-toolbar class="rounded-t-md" flat>
                                            <v-toolbar-title>Requisitos do nível</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-dialog v-model="dialogRequisitoNivel" max-width="500px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        color="primary"
                                                        variant="tonal"
                                                        dark
                                                        @click="abrirDialogCriarRequisitoNivel"
                                                        data-test="buttonAdicionarRequisitoNivel"
                                                        >Adicionar requisito</v-btn
                                                    >
                                                </template>
                                                <v-card>
                                                    <v-card-title class="pa-4">
                                                        <span class="text-h5">Criar requisito do nível</span>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-container class="px-0">
                                                            <v-row>
                                                                <v-col cols="12">
                                                                    <v-label class="font-weight-medium mb-2">Tipo *</v-label>
                                                                    <v-select
                                                                        :items="tiposRequisitos"
                                                                        item-title="tipo"
                                                                        item-value="value"
                                                                        placeholder="Selecione um tipo de requisito"
                                                                        hide-details
                                                                        required
                                                                        v-model="formRequisitoNivel.Tipo"
                                                                        data-test="selectTipoRequisitoNivel"
                                                                    >
                                                                    </v-select>
                                                                </v-col>
                                                                <v-col cols="12">
                                                                    <v-label class="font-weight-medium mb-2">Descrição *</v-label>
                                                                    <VTextarea
                                                                        auto-grow
                                                                        placeholder="Escreva a descrição do requisito"
                                                                        rows="2"
                                                                        color="primary"
                                                                        row-height="25"
                                                                        shaped
                                                                        hide-details
                                                                        required
                                                                        v-model="formRequisitoNivel.Descricao"
                                                                        data-test="textareaDescricaoRequisitoNivel"
                                                                        @input="atualizarContadorDescricaoRequisitoNivel"
                                                                    ></VTextarea>
                                                                    <v-label
                                                                        class="font-weight-small mt-1"
                                                                        :class="{ 'text-danger': contadorDescricaoRequisitoNivel > 500 }"
                                                                    >
                                                                        {{ contadorDescricaoRequisitoNivel }}/500 caracteres
                                                                    </v-label>
                                                                </v-col>
                                                            </v-row>
                                                        </v-container>
                                                    </v-card-text>

                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="primary" variant="outlined" dark @click="closeRequisitoNivel" data-test="buttonCancelarRequisitoNivel">
                                                            Cancelar
                                                        </v-btn>
                                                        <v-btn
                                                            color="primary"
                                                            variant="flat"
                                                            dark
                                                            @click="onSubmitRequisitoNivel(formRequisitoNivel.Id)"
                                                            data-test="buttonSalvarRequisitoNivel"
                                                        >
                                                            Salvar
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                            <v-dialog v-model="dialogDeleteRequisitoNivel" max-width="500px">
                                                <v-card>
                                                    <v-card-title class="text-h5 text-center py-6">Você tem certeza que deseja deletar esse requisito?</v-card-title>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="primary" variant="outlined" dark @click="closeDeleteRequisitoNivel" data-test="buttonCancelarDeletarRequisitoNivel">Cancelar</v-btn>
                                                        <v-btn color="primary" variant="flat" dark @click="deleteItemConfirmRequisitoNivel" data-test="buttonDeletarRequisitoNivel">Deletar</v-btn>
                                                        <v-spacer></v-spacer>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item.actions="{ item }: { item: ItemTabelaInterface }">
                                        <v-icon color="primary" size="small" class="me-2" @click="editItemRequisitoNivel(item.Id)" data-test="iconEditarRequisitoNivel">
                                            mdi-pencil
                                        </v-icon>
                                        <v-icon color="error" size="small" @click="confirmDeleteItemRequisitoNivel(item.Id)" data-test="iconDeletarRequisitoNivel">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <template v-slot:item.Descricao="{ item }: { item: ItemTabelaInterface }">
                                        <div class="descricao-cell">{{ item.Descricao }}</div>
                                    </template>
                                    <template v-slot:no-data>
                                        <v-label>Sem dados!</v-label>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="flat" dark @click="closeNivel" data-test="buttonFecharNivel"> Fechar </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDeleteNivel" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5 text-center py-6">Você tem certeza que deseja deletar esse nível?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="outlined" dark @click="closeDeleteNivel" data-test="buttonCancelarDeletarNivel">Cancelar</v-btn>
                            <v-btn color="primary" variant="flat" dark @click="deleteItemConfirmNivel" data-test="buttonDeletarNivel">Deletar</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon color="primary" size="small" class="me-2" @click="editItemNivel(item.Id)" data-test="iconEditarNivel"> mdi-pencil </v-icon>
            <v-icon color="error" size="small" @click="confirmDeleteItemNivel(item.Id)" data-test="iconDeletarNivel"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
            <v-label>Sem dados!</v-label>
        </template>
    </v-data-table>
    <v-row class="pa-3">
        <v-btn color="error" class="ma-2" variant="outlined" @click="deletarVersao" data-test="buttonExcluirVersao">Excluir versão</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="ma-2" variant="outlined" @click="salvarSair" data-test="buttonSalvarSair">Salvar e sair</v-btn>
        <v-btn color="primary" class="ma-2" @click="ativarVersao" data-test="buttonAtivarVersao">Ativar versão de modalidade</v-btn>
    </v-row>
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
.text-danger {
    color: red;
}
</style>

<script async setup lang="ts">
// IMPORTACOES
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import services from '../../../services/requires/require';
dayjs.extend(utc);

// Definição de data máxima e mínima
const minDate = '1960-01-01';
const maxDate = '9999-12-30';

// DECLARACAO E INICIALIZACAO
// Services
import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
import MoedaGenericObject from '@/services/requires/objects/modalidadebolsa/Moeda';
import NivelGenericObject from '@/services/requires/objects/modalidadebolsa/Nivel';
import RequisitoGenericObject from '@/services/requires/objects/modalidadebolsa/Requisito';
import ResolucaoGenericObject from '@/services/requires/objects/modalidadebolsa/Resolucao';
import VersaoModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/VersaoModalidade';
import VersaoNivelGenericObject from '@/services/requires/objects/modalidadebolsa/VersaoNivel';
const ModalidadeObject = new ModalidadeGenericObject({});
const ResolucaoObject = new ResolucaoGenericObject({});
const VersaoModalidadeObject = new VersaoModalidadeGenericObject({});
const NivelObject = new NivelGenericObject({});
const VersaoNivelObject = new VersaoNivelGenericObject({});
const MoedaObject = new MoedaGenericObject({});
const RequisitoObject = new RequisitoGenericObject({});

const { list: listModalidade } = services(ModalidadeObject.count);
const { update: updateModalidade } = services(ModalidadeObject.entity);
const { post: postNivel } = services(NivelObject.entity);
const { post: postVersaoNivel, update: updateVersaoNivel, remove: removeVersaoNivel } = services(VersaoNivelObject.entity);
const { update: updateVersaoModalidade } = services(VersaoModalidadeObject.entity);
const { list: listResolucao } = services(ResolucaoObject.entity);
const { list: listMoeda } = services(MoedaObject.entity);
const { post: postRequisito, update: updateRequisito, remove: removeRequisito } = services(RequisitoObject.entity);
// Boolean
const botaoAdicionarRequisito = ref(false);
const botaoAdicionarNivel = ref(false);
const botaoAdicionarRequisitoNivel = ref(false);
const dialogRequisito = ref(false);
const dialogRequisitoNivel = ref(false);
const dialogNiveis = ref(false);
const dialogDeleteRequisito = ref(false);
const dialogDeleteRequisitoNivel = ref(false);
const dialogDeleteNivel = ref(false);
const siglaNivelRequired = ref(false);
const haReducaoPorVinculo = ref(false);
const modalidadeUnicaEmEdicao = ref(false);
const disabled = ref(true);

// Cores
const botaoColorRequisito = ref('lightprimary');
const botaoColorNivel = ref('lightprimary');
const botaoColorRequisitoNivel = ref('lightprimary');

// Arrays
const requisitos = ref<RequisitoInterface[]>([]);
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
const moedas = ref<{ Nome: string; Simbolo: string; Id: string }[]>([]);
const niveis = ref<NivelCompletoVersaoModalidadeInterface[]>([]);
const modalidadesSelect = ref<{ sigla: string; id: string }[]>([]);

// Delete id
const requisitoDelete = ref();
const requisitoNivelDelete = ref();
const nivelDelete = ref();

// Relativo a rotas
const router = useRouter();
const route = useRoute();
const params = route.params;
const page = ref({ title: 'Alterar Versão da Modalidade' });
const breadcrumbs = ref([
    { text: 'Modalidade', disabled: false, href: '/modalidade/IndexModalidade' },
    { text: page.value.title, disabled: true, href: '#' }
]);

// Headers tabelas
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
// Forms
const formModalidade = reactive({
    Sigla: '',
    Nome: '',
    Id: '',
    id: ''
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
const formRequisitoModalidade = reactive({
    Id: null as string | null,
    Tipo: null as number | null,
    Descricao: '',
    VersaoId: '',
    id: ''
});
const formNivel = reactive({
    Id: null as string | null,
    Sigla: '',
    SiglaNivel: '',
    id: null as string | null
});
const formVersaoNivel = reactive({
    Id: '',
    Valor: null,
    MoedaId: null as string | null,
    NivelBolsaId: null as string | null,
    VersaoModalidadeId: '',
    id: null as string | null
});
const formRequisitoNivel = reactive({
    Id: null as string | null,
    Tipo: null as number | null,
    Descricao: '',
    VersaoId: '',
    id: ''
});
// Interfaces
interface RequisitoInterface {
    Tipo: string;
    Descricao: string;
    Id: string;
}
interface ResolucaoInterface {
    Numero: number;
    Id: number;
}
interface VersaoModalidadeInterface {
    Sigla: string;
    VersaoNiveis: never[];
    Estado: string;
    DataInicioVigencia: string | number | Date | dayjs.Dayjs | null | undefined;
    Resolucao: { Id: null };
    RequisitoBolsas: never[];
    Id: string;
    ReducaoPorVinculo: null;
    ModalidadeBolsaCompativeis: { Id: null }[];
    Descricao: string;
}
interface NivelVersaoModalidadeInterface {
    Id: string;
    Valor: number;
    Moeda: { Nome: string };
    NivelBolsa: { Sigla: string };
}
interface NivelCompletoVersaoModalidadeInterface {
    Id: string;
    Sigla: string;
    Valor: string;
    Moeda: string;
}
const versoes = ref<VersaoModalidadeInterface[]>([]);
interface VersaoModalidadeInterface {
    Sigla: string;
    Estado: string;
    [key: string]: any;
}

interface ItemTabelaInterface {
    Id: string;
    Descricao: string;
}

function formatMoney(value: any) {
    return new Intl.NumberFormat(undefined,{
        style: "currency",
        currency: "BRT"
    }).format(value).replace("BRT", "");
}

// AO CARREGAR A PAGINA
onMounted(async () => {
    getPostsResolucao();
    getPostsModalidade();
    if (params.id) {
        const ModalidadeObject = new ModalidadeGenericObject({ id: Array.isArray(params.id) ? params.id.join(',') : params.id });
        const { list: listConsultarModalidade } = services(ModalidadeObject.modalidadeConsult);
        const alterarModalidade = await listConsultarModalidade();
        carregarModalidade(alterarModalidade.value[0]);
        modalidadeUnica(alterarModalidade);
        ativarBotaoAdicionarRequisito();
        ativarBotaoAdicionarNivel();
        versoes.value = alterarModalidade.value[0].VersaoModalidadesBolsas;
        formVersaoModalidade.ModalidadeBolsaId = validarParametroRota();
        carregarVersao(alterarModalidade, 'EM_EDICAO');
        atualizaContadorDescricaoRequisitoModalidade();
    }
    if (params.resolucao) {
        carregaResolucaoCriada(params.resolucao);
    }
});

// FUNCOES AO CARREGAR A PAGINA
const modalidadeUnica = (alterarModalidade: any) => {
    if (
        alterarModalidade.value[0].VersaoModalidadesBolsas.length == 1 &&
        alterarModalidade.value[0].VersaoModalidadesBolsas[0].Estado == 'EM_EDICAO'
    ) {
        modalidadeUnicaEmEdicao.value = true;
        disabled.value = false;
    } else {
        modalidadeUnicaEmEdicao.value = false;
        disabled.value = true;
    }
};

const carregarVersao = (versaoModalidade: any, estado: string) => {
    versaoModalidade.value[0].VersaoModalidadesBolsas.forEach((versaoModalidade: VersaoModalidadeInterface) => {
        if (versaoModalidade.Estado == estado) {
            formVersaoModalidade.Estado = estadoEmEdicao(versaoModalidade.Estado);
            formVersaoModalidade.Sigla = versaoModalidade.Sigla;
            formVersaoModalidade.Descricao = versaoModalidade.Descricao;
            formVersaoModalidade.Id = versaoModalidade.Id;
            formVersaoModalidade.id = versaoModalidade.Id;
            formVersaoModalidade.ResolucaoId = versaoModalidade.Resolucao.Id;
            formVersaoModalidade.DataInicioVigencia = dayjs(versaoModalidade.DataInicioVigencia).utc().format('YYYY-MM-DD');
            formVersaoModalidade.ReducaoPorVinculo = (versaoModalidade.ReducaoPorVinculo ?? 100) * 100;
            if (versaoModalidade.ReducaoPorVinculo != 1) haReducaoPorVinculo.value = true;
            requisitos.value = corrigirListaRequisitos(versaoModalidade.RequisitoBolsas);
            
            formRequisitoModalidade.VersaoId = versaoModalidade.Id;
            formVersaoNivel.VersaoModalidadeId = versaoModalidade.Id;
            formVersaoModalidade.ModalidadeBolsaCompativeis = versaoModalidade.ModalidadeBolsaCompativeis.map((item) => item.Id);
            carregarNiveisVersao(versaoModalidade);
        }
    });
};

function corrigirListaRequisitos(requisitos: Array<{ Tipo: string; Descricao: string; Id: string }>) {
    requisitos.forEach((requisito: { Tipo: string; Descricao: string; Id: string }) => {
        requisito.Tipo = corrigirEscritaTipoRequisitos(requisito.Tipo);
    });
    return requisitos;
}

function corrigirEscritaTipoRequisitos(tipo: string) {
    if (tipo == 'QUALIFICACAO') return 'Qualificação';
    if (tipo == 'VINCULO') return 'Vínculo';
    if (tipo == 'ACUMULO') return 'Acúmulo';
    if (tipo == 'RESIDENCIA') return 'Residência';
    if (tipo == 'DOCUMENTACAO') return 'Documentação';
    if (tipo == 'VIGENCIA') return 'Vigência';
    if (tipo == 'PARENTESCO') return 'Parentesco';
    if (tipo == 'ADIMPLENCIA') return 'Adimplência';
    if (tipo == 'OUTRO') return 'Outro';
    return '';
}

const carregarNiveisVersao = (versaoModalidadeEmEdicao: any) => {
    versaoModalidadeEmEdicao.VersaoNiveis.forEach((nivelVersaoModalidade: NivelVersaoModalidadeInterface) => {
        const nivelCompletoVersaoModalidade: NivelCompletoVersaoModalidadeInterface = {
            Id: nivelVersaoModalidade.Id,
            Valor: Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nivelVersaoModalidade.Valor),
            Moeda: nivelVersaoModalidade.Moeda.Nome,
            Sigla: nivelVersaoModalidade.NivelBolsa.Sigla
        };
        niveis.value.push(nivelCompletoVersaoModalidade);
    });
};

const carregarModalidade = (modalidade: any) => {
    formModalidade.Nome = modalidade.Nome;
    formModalidade.Sigla = modalidade.Sigla;
    formModalidade.Id = modalidade.Id;
    formModalidade.id = modalidade.Id;
};

const validarParametroRota = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    } else {
        return params.id;
    }
};

const carregaResolucaoCriada = (idResolucao: any) => {
    formVersaoModalidade.ResolucaoId = idResolucao;
};

const estadoEmEdicao = (estado: string) => {
    if (estado == 'EM_EDICAO') return 'Em edição';
    return estado;
};

// NAVEGACAO
const navigateBack = () => {
    router.push({ path: '/modalidade/IndexModalidade' });
};

const incluirResolucao = () => {
    router.push({ name: 'CadastroResolucao', params: { id: null, modalidade: `EditModalidade/${params.id}` } });
};

// RESOLUCAO
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
    data.value.forEach((resolucaoData: ResolucaoInterface) => {
        resolucoes.value.push({
            numero: `Resolução ${resolucaoData.Numero}`,
            id: resolucaoData.Id
        });
    });
};

// MODALIDADE E VERSAO MODALIDADE
const getPostsModalidade = async () => {
    try {
        const data = await listModalidade();
        modalidadesSelect.value = [];
        data.value.forEach((element: { Sigla: string; Id: string }) => {
            modalidadesSelect.value.push({ sigla: element.Sigla, id: element.Id });
        });
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

const onSubmit = async () => {
    try {
        formVersaoModalidade.ModalidadeBolsaCompativeis = criarBolsasCompativeisForm();
        alterarReducaoPorVinculo('division');
        if (modalidadeUnicaEmEdicao) {
            await updateModalidade(formModalidade);
        }
        if (params.id) {
            await updateVersaoModalidade(formVersaoModalidade);
        }
        salvoComSucesso();
    } catch (error: any) {
        erroSubmit(error);
    } finally {
        formVersaoModalidade.ModalidadeBolsaCompativeis = resetarBolsasCompativeis();
        alterarReducaoPorVinculo('multiplication');
    }
};

// FUNCOES PARA ONSUBMIT
const salvoComSucesso = () => {
    Swal.fire({ title: 'Salvo com sucesso!', icon: 'success', showConfirmButton: false, timer: 700 });
};
const criarBolsasCompativeisForm = () => {
    return Object.values(formVersaoModalidade.ModalidadeBolsaCompativeis).map((value) => ({ id: value }));
};
const alterarReducaoPorVinculo = (operacao: string) => {
    if (operacao == 'multiplication') formVersaoModalidade.ReducaoPorVinculo = (formVersaoModalidade.ReducaoPorVinculo ?? 100) * 100;
    if (operacao == 'division') formVersaoModalidade.ReducaoPorVinculo = (formVersaoModalidade.ReducaoPorVinculo ?? 100) / 100;
};
const erroSubmit = (error: any) => {
    console.error(error);
    if (error.response.data.errors['$.Valor']) {
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: 'O valor inserido não é suportado!', confirmButtonColor: '#D3D3D3' });
        return;
    }
    if (error.response.data.errors) {
        Swal.fire({
            title: 'Erro ao salvar!',
            icon: 'error',
            text: error.response.data.errors[0].mensagem.split(':')[1],
            confirmButtonColor: '#D3D3D3'
        });
        return;
    }
    if (error.response.data.message) {
        Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: error.response.data.message, confirmButtonColor: '#D3D3D3' });
        return;
    }
    Swal.fire({ title: 'Erro ao salvar!', icon: 'error', text: 'Ocorreu um erro não identificado!', confirmButtonColor: '#D3D3D3' });
};
const resetarBolsasCompativeis = () => {
    return formVersaoModalidade.ModalidadeBolsaCompativeis.map((item) => item.id);
};

// REQUISITOS
const ativarBotaoAdicionarRequisito = () => {
    botaoAdicionarRequisito.value = true;
    botaoColorRequisito.value = 'primary';
};

const onSubmitRequisito = async (id: string | null = null) => {
    try {
        if (id) {
            formRequisitoModalidade.id = id;
            await updateRequisito(formRequisitoModalidade);
        } else {
            await postRequisito(formRequisitoModalidade);
        }
        Swal.fire({
            title: 'Salvo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#D3D3D3',
            showConfirmButton: false,
            timer: 700
        });
        getPostsRequisito();
    } catch (error) {
        erroSubmit(error);
    }
    limparDialogRequisitoModalidade();
    closeRequisito();
};

const limparDialogRequisitoModalidade = () => {
    formRequisitoModalidade.Tipo = null;
    formRequisitoModalidade.Descricao = '';
    contadorDescricaoRequisitoModalidade.value = 0;
};

const getPostsRequisito = async () => {
    try {
        const VersaoModalidadeObject = new VersaoModalidadeGenericObject({ id: formRequisitoModalidade.VersaoId });
        const { list: listRequisito } = services(VersaoModalidadeObject.versaoModalidadeDetails);
        const data = await listRequisito();
        requisitos.value = data.value[0].RequisitoBolsas;
    } catch (error) {
        erroSubmit(error);
    }
};

const editItemRequisito = async (id: string) => {
    try {
        dialogRequisito.value = true;
        formRequisitoModalidade.Id = id;
        const { getById: getByIdRequisito } = services(RequisitoObject.entity);
        const response = await getByIdRequisito(id);
        const data = response.value[0];
        formRequisitoModalidade.Tipo = factoryTipo(data.Tipo);
        formRequisitoModalidade.Descricao = data.Descricao;
    } catch (error) {
        erroSubmit(error);
    }
};
const deleteItemConfirmRequisito = async () => {
    try {
        await removeRequisito(requisitoDelete.value);
        closeDeleteRequisito();
        getPostsRequisito();
        Swal.fire({
            title: 'Deletado com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 700
        });
    } catch (error) {
        erroSubmit(error);
    }
};

function closeRequisito() {
    limparDialogRequisitoModalidade();
    dialogRequisito.value = false;
}

function confirmDeleteItemRequisito(id: string) {
    dialogDeleteRequisito.value = true;
    requisitoDelete.value = id;
}

function closeDeleteRequisito() {
    dialogDeleteRequisito.value = false;
}

function abrirDialogCriarRequisito() {
    limparDialogRequisitoModalidade();
    if (botaoAdicionarRequisito.value) {
        dialogRequisito.value = true;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Crie uma modalidade antes de incluir requisitos!',
            confirmButtonColor: '#D3D3D3'
        });
    }
}

const factoryTipo = (tipo: string) => {
    if (tipo == 'QUALIFICACAO') return 0;
    if (tipo == 'VINCULO') return 1;
    if (tipo == 'ACUMULO') return 2;
    if (tipo == 'RESIDENCIA') return 3;
    if (tipo == 'DOCUMENTACAO') return 4;
    if (tipo == 'VIGENCIA') return 5;
    if (tipo == 'PARENTESCO') return 6;
    if (tipo == 'ADIMPLENCIA') return 7;
    if (tipo == 'OUTRO') return 8;
    return null;
};

// NIVEL
const getPostsMoedas = async () => {
    try {
        const data = await listMoeda();
        moedas.value = data.value;
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

function abrirDialogCriarNivel() {
    if (botaoAdicionarRequisito.value) {
        getPostsMoedas();
        desativarBotaoAdicionarRequisitoNivel();
        limparCamposNivel();
        dialogNiveis.value = true;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Crie uma modalidade antes de incluir níveis!',
            confirmButtonColor: '#D3D3D3'
        });
    }
}

const limparCamposNivel = () => {
    siglaNivelRequired.value = false;
    formNivel.Sigla = '';
    formNivel.SiglaNivel = '';
    formNivel.Id = '';
    formNivel.id = '';
    limparVersaoNivel();
    limparRequisitoNivel();
};

const limparRequisitoNivel = () => {
    requisitosNivel.value = [];
    contadorDescricaoRequisitoNivel.value = 0;
};

const limparVersaoNivel = () => {
    formVersaoNivel.MoedaId = null;
    formVersaoNivel.Valor = null;
    formVersaoNivel.Id = '';
    formVersaoNivel.id = '';
};

const ativarBotaoAdicionarNivel = () => {
    botaoAdicionarNivel.value = true;
    botaoColorNivel.value = 'primary';
};

const onSubmitNivel = async () => {
    try {
        if (formVersaoNivel.Id) {
            await updateVersaoNivel(formVersaoNivel);
            dialogNiveis.value = false;
        } else {
            formNivel.Sigla = formModalidade.Sigla + '-' + formNivel.SiglaNivel;
            
            const nivelCriado = await postNivel(formNivel);
            formVersaoNivel.NivelBolsaId = nivelCriado.uri.replace('/api/modalidadebolsa/nivelbolsa/', '');
            const versaoNivelCriado = await postVersaoNivel(formVersaoNivel);
            formVersaoNivel.Id = versaoNivelCriado.uri.replace('/api/modalidadebolsa/versaonivelbolsa/', '');
            formVersaoNivel.id = versaoNivelCriado.uri.replace('/api/modalidadebolsa/versaonivelbolsa/', '');
            formRequisitoNivel.VersaoId = versaoNivelCriado.uri.replace('/api/modalidadebolsa/versaonivelbolsa/', '');
            dialogNiveis.value = false;
            siglaNivelRequired.value = true;
            ativarBotaoAdicionarRequisitoNivel();
        }
        Swal.fire({
            title: 'Salvo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#D3D3D3',
            showConfirmButton: false,
            timer: 700
        }).then(() => {
            dialogNiveis.value = true;
        });
        getPostsNivel();
    } catch (error: any) {
        dialogNiveis.value = false;
        erroSubmit(error);
    }
    limparDialogRequisitoModalidade();
    closeNivel();
};

const getPostsNivel = async () => {
    try {
        const VersaoModalidadeObject = new VersaoModalidadeGenericObject({ id: formVersaoNivel.VersaoModalidadeId });
        const { getById: getByIdNivel } = services(VersaoModalidadeObject.versaoModalidadeList);
        const data = await getByIdNivel();
        
        niveis.value = [];
        carregarNiveisVersao(data.value[0]);
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

const editItemNivel = async (id: string) => {
    try {
        getPostsMoedas();
        ativarBotaoAdicionarRequisitoNivel();
        siglaNivelRequired.value = true;
        formVersaoNivel.Id = id;
        formVersaoNivel.id = id;
        formRequisitoNivel.VersaoId = id;
        getPostsRequisitoNivel();
        const VersaoNivelObject = new VersaoNivelGenericObject({ id: id });
        const { getById: getByIdVersaoNivelDetalhes } = services(VersaoNivelObject.versaoNivelDetails);
        const response = await getByIdVersaoNivelDetalhes();
        const data = response.value[0];
        formNivel.SiglaNivel = data.NivelBolsa.Sigla.replace(`${formModalidade.Sigla}-`, '');
        formVersaoNivel.NivelBolsaId = data.NivelBolsa.Id;
        formVersaoNivel.MoedaId = data.Moeda.Id;
        formVersaoNivel.Valor = data.Valor;
        dialogNiveis.value = true;
    } catch (error: any) {
        erroSubmit(error);
    }
};

const deleteItemConfirmNivel = async () => {
    try {
        await removeVersaoNivel(nivelDelete.value);
        closeDeleteNivel();
        getPostsNivel();
        Swal.fire({
            title: 'Deletado com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 700
        });
    } catch (error) {
        erroSubmit(error);
    }
};

function closeNivel() {
    dialogNiveis.value = false;
    limparDialogRequisitoModalidade();
}

function confirmDeleteItemNivel(id: string) {
    dialogDeleteNivel.value = true;
    nivelDelete.value = id;
}

function closeDeleteNivel() {
    dialogDeleteNivel.value = false;
}

// REQUISITOS NIVEL
const ativarBotaoAdicionarRequisitoNivel = () => {
    botaoAdicionarRequisitoNivel.value = true;
    botaoColorRequisitoNivel.value = 'primary';
};

const desativarBotaoAdicionarRequisitoNivel = () => {
    botaoAdicionarRequisitoNivel.value = false;
    botaoColorRequisitoNivel.value = 'lightprimary';
};

const onSubmitRequisitoNivel = async (id: string | null = null) => {
    try {
        if (id) {
            formRequisitoNivel.id = id;
            await updateRequisito(formRequisitoNivel);
            dialogNiveis.value = false;
        } else {
            await postRequisito(formRequisitoNivel);
            dialogNiveis.value = false;
        }
        Swal.fire({
            title: 'Salvo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#D3D3D3',
            showConfirmButton: false,
            timer: 700
        }).then(() => {
            dialogNiveis.value = true;
        });
        getPostsRequisitoNivel();
    } catch (error) {
        dialogNiveis.value = false;
        erroSubmit(error);
    }
    limparDialogRequisitoNivel();
    closeRequisitoNivel();
};

const limparDialogRequisitoNivel = () => {
    formRequisitoNivel.Tipo = null;
    formRequisitoNivel.Descricao = '';
    contadorDescricaoRequisitoNivel.value = 0;
};

const getPostsRequisitoNivel = async () => {
    try {
        const VersaoNivelObject = new VersaoNivelGenericObject({ id: formRequisitoNivel.VersaoId });
        const { list: listRequisitoNivel } = services(VersaoNivelObject.versaoNivelDetails);
        const data = await listRequisitoNivel();
        requisitosNivel.value = data.value[0].RequisitoBolsas;
    } catch (error) {
        erroSubmit(error);
    }
};

const editItemRequisitoNivel = async (id: string) => {
    try {
        dialogRequisitoNivel.value = true;
        formRequisitoNivel.Id = id;
        const { getById: getByIdRequisitoNivel } = services(RequisitoObject.entity);
        const response = await getByIdRequisitoNivel(id);
        const data = response.value[0];
        formRequisitoNivel.Tipo = factoryTipo(data.Tipo);
        formRequisitoNivel.Descricao = data.Descricao;
        contadorDescricaoRequisitoNivel.value = formRequisitoNivel.Descricao.length;
    } catch (error) {
        erroSubmit(error);
    }
};

const deleteItemConfirmRequisitoNivel = async () => {
    try {
        await removeRequisito(requisitoNivelDelete.value);
        closeDeleteRequisitoNivel();
        getPostsRequisitoNivel();
        dialogNiveis.value = false;
        Swal.fire({
            title: 'Deletado com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 700
        }).then(() => {
            dialogNiveis.value = true;
        });
    } catch (error) {
        erroSubmit(error);
    }
};

function closeRequisitoNivel() {
    limparDialogRequisitoNivel();
    dialogRequisitoNivel.value = false;
}

function confirmDeleteItemRequisitoNivel(id: string) {
    dialogDeleteRequisitoNivel.value = true;
    requisitoNivelDelete.value = id;
}

function closeDeleteRequisitoNivel() {
    dialogDeleteRequisitoNivel.value = false;
}

function abrirDialogCriarRequisitoNivel() {
    limparDialogRequisitoNivel();
    if (botaoAdicionarRequisitoNivel.value) {
        dialogRequisitoNivel.value = true;
    } else {
        dialogNiveis.value = false;
        Swal.fire({
            icon: 'error',
            title: 'Crie o nível antes de incluir requisitos!',
            confirmButtonColor: '#D3D3D3'
        }).then(() => {
            dialogNiveis.value = true;
        });
    }
}

// BOTOES FINAIS
const deletarVersao = async () => {
    Swal.fire({
        title: 'Tem certeza que quer deletar essa versão da modalidade?',
        text: 'Essa ação é definitiva e irreversível.',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        confirmButtonColor: '#F4796B',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#D3D3D3'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const { remove: removeVersaoModalidade } = services(VersaoModalidadeObject.entity);
                await removeVersaoModalidade(formVersaoModalidade.Id);
                Swal.fire({
                    title: 'Deletado com sucesso!',
                    icon: 'success',
                    timer: 700,
                    showConfirmButton: false
                }).then(() => {
                    router.push({ path: '/modalidade/IndexModalidade' });
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    text: 'Não foi possível apagar a modalidade',
                    confirmButtonColor: '#D3D3D3'
                });
            }
        }
    });
};
const salvarSair = () => {
    router.push({ path: '/modalidade/IndexModalidade' });
};
const ativarVersao = async () => {
    Swal.fire({
        title: 'Tem certeza que quer ativar essa modalidade?',
        text: 'Essa ação é definitiva e irreversível.',
        showCancelButton: true,
        confirmButtonText: 'Ativar',
        confirmButtonColor: '#D3D3D3', 
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#F4796B'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const { activate } = services(ModalidadeObject.entity);
                await activate(formVersaoModalidade.ModalidadeBolsaId);
                
                Swal.fire({
                    title: 'Modalidade publicada!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#D3D3D3' 
                });
                
                

                router.push({ path: '/modalidade/IndexModalidade' });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao salvar!',
                    confirmButtonColor: '#D3D3D3' 
                });
            }
        }
    });
};


const contadorDescricaoRequisitoModalidade = ref(0);

const atualizaContadorDescricaoRequisitoModalidade = () => {
    contadorDescricaoRequisitoModalidade.value = formRequisitoModalidade.Descricao.length;
};

const contadorDescricaoRequisitoNivel = ref(0);

const atualizarContadorDescricaoRequisitoNivel = () => {
    contadorDescricaoRequisitoNivel.value = formRequisitoNivel.Descricao.length;
};

const contadorSiglaNivelBolsa = ref(0);

const atualizarContadorSiglaNivelBolsa = () => {
    contadorSiglaNivelBolsa.value = formNivel.SiglaNivel.length;
};
</script>
