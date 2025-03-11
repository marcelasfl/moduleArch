<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

// common components
import UiParentCard from '@/components/shared/UiParentCard.vue';
// theme breadcrumb


const theme = useTheme();
const chartOptions = computed(() => {
    return {
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: `inherit`,
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
        },
        colors: ['#03C9D7', '#FEC90F', '#FB9678'],
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '20%'
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },

        xaxis: {
            categories: ['Fev', 'Mar', 'Abr', 'Mai']
        },
        yaxis: {
          title: {
            text: 'R$ (milhares)',
          },
        },
        fill: {
            opacity: 1
        },
       
        tooltip: {
            theme: 'dark',
            y: {
              formatter(val:any) {
                return `R$ ${val} reais`;
              },
            },
        },
        grid: {
          show: false,
        },
        legend: {
          show: true,
          position: 'bottom',
          width: '50px',
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false
                    }
                }
            }
        ]
    };
});

const columnChart = {
    series: [
        {
            name: 'Valor das bolsas pagas',
            data: [44.000, 55.000, 57.000, 56.000 ]
        },

        {
            name: 'Valor das bolsas alocadas',
            data: [35.000, 41.000, 36.000, 26.000 ]
        },
        {
            name: 'Saldo total do projeto',
            data: [76.000, 85.000, 101.000, 98.000 ]
        },
    ]
};
</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Column Chart -->
    <!-- ---------------------------------------------------- -->
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Saldo das bolsas por mês">
                <apexchart type="bar" height="300" :options="chartOptions" :series="columnChart.series"> </apexchart>
            </UiParentCard>
        </v-col>
    </v-row>
</template>