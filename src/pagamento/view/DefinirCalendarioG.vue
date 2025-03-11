<template>
  <BaseBreadcrumb title="Plano Mensal" :breadcrumbs="[{ text: 'Plano Mensal', disabled: true, href: '#' }]" />

  <GenericTable
    title="Plano Mensal"
    :headers="[
      { title: 'Mês', sortable: true, key: 'Mes' },
      { title: 'Marco Solicitação de Bolsa', sortable: true, key: 'MarcoSolicitacaoBolsa' },
      { title: 'Marco Geração da Folha', sortable: true, key: 'MarcoGeracaoFolha' },
      { title: 'Marco de Pagamento', sortable: true, key: 'MarcoPagamento' },
      { title: 'É Atual?', sortable: true, key: 'EhAtual' },
      { title: 'Ações', sortable: false, key: 'actions' }
    ]"
    
    :createFields="[
      { key: 'Mes', label: 'Mês', required: true, validator: validatorMes, 'data-test': 'mes-input' },
      { key: 'MarcoSolicitacaoBolsa', label: 'Marco Solicitação Bolsa', required: true, type: 'date', validator: validatorMarcoSolicitacaoBolsa, 'data-test': 'marco-solicitacao-bolsa-input' },
      { key: 'MarcoGeracaoFolha', label: 'Marco Geração Folha', required: true, type: 'date', validator: validatorMarcoGeracaoFolha, 'data-test': 'marco-geracao-folha-input' },
      { key: 'MarcoPagamento', label: 'Marco Pagamento', required: true, type: 'date', validator: validatorMarcoPagamento, 'data-test': 'marco-pagamento-input' },
      { key: 'EhAtual', label: 'É Atual?', required: false, type: 'checkbox', validator: validatorEhAtual, 'data-test': 'eh-atual-input' }
    ]"

    :store="usePlanoMensalStore"
    searchKey="Mes"
    createRoute="/PlanoMensal/formPlanoMensal"
    editRoute="/PlanoMensal/formPlanoMensal/:id"
    detailRoute="/PlanoMensal/detailsPlanoMensal/:id"
  />
</template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { usePlanoMensalStore } from '../controller/store/PlanoMensalStore';
import GenericTable from './generic/GenericTable.vue'; // Verifique o caminho



// Validadores dos campos
import PlanoMensalRules from '../model/PlanoMensalRules';
const planoMensalRules = new PlanoMensalRules();
const validatorMes = planoMensalRules.getRulesByFieldName("Mes");
const validatorEhAtual = planoMensalRules.getRulesByFieldName("EhAtual");
const validatorMarcoSolicitacaoBolsa = planoMensalRules.getRulesByFieldName("MarcoSolicitacaoBolsa");
const validatorMarcoGeracaoFolha = planoMensalRules.getRulesByFieldName("MarcoGeracaoFolha");
const validatorMarcoPagamento = planoMensalRules.getRulesByFieldName("MarcoPagamento");
</script>

