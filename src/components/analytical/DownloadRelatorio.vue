<script setup lang="ts">
import html2canvas from 'html2canvas'; // Importa a biblioteca
import { computed, ref } from 'vue';
import { useAreaTecnicaSelectStore } from '../../dashboard/controller/store/AreaTecnicaSelectStore';
import { useEditalSelectStore } from '../../dashboard/controller/store/EditalSelectStore';
import { useProjetoSelectStore } from '../../dashboard/controller/store/ProjetoSelectStore';

const areaTecnicaStore = useAreaTecnicaSelectStore();
const editalStore = useEditalSelectStore();
const projetoStore = useProjetoSelectStore();

const dialogDelete = ref(false);
const capturedImage: Ref<string | null> = ref(null);


const expandImage = () => {
  if (!capturedImage.value) return;

  // Criar uma URL que redireciona para uma nova página
  const expandedImagePageUrl = `/expand-image?image=${encodeURIComponent(capturedImage.value)}`;
  window.open(expandedImagePageUrl, '_blank');
};

const VisualizaRelatorio = async () => {
  const elements = [
    document.querySelector('#container') as HTMLElement,
    // document.querySelector('#orcamento-card') as HTMLElement,
    // document.querySelector('#modalidades-edital-projeto') as HTMLElement
  ];

  if (elements.some((el) => !el)) {
    console.error('Um ou mais elementos não foram encontrados!');
    return;
  }

  // Capturar os elementos como canvas
  const canvases = await Promise.all(
    elements.map(async (element) => html2canvas(element))
  );

  // Criar um canvas combinado
  const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
  const maxWidth = Math.max(...canvases.map((canvas) => canvas.width));

  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = maxWidth;
  combinedCanvas.height = totalHeight;

  const ctx = combinedCanvas.getContext('2d');
  if (!ctx) return;

  let offsetY = 0;
  canvases.forEach((canvas) => {
    ctx.drawImage(canvas, 0, offsetY);
    offsetY += canvas.height;
  });

  // Reduzir o tamanho da imagem final
  const scale = 0.5; // Fator de redução (50%)
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = combinedCanvas.width * scale;
  resizedCanvas.height = combinedCanvas.height * scale;

  const resizedCtx = resizedCanvas.getContext('2d');
  if (!resizedCtx) return;

  resizedCtx.drawImage(
    combinedCanvas,
    0,
    0,
    combinedCanvas.width,
    combinedCanvas.height,
    0,
    0,
    resizedCanvas.width,
    resizedCanvas.height
  );

  capturedImage.value = resizedCanvas.toDataURL("image/png");
  dialogDelete.value = true;
};


// Computed para desabilitar o botão
const isDownloadDisabled = computed(() => {
    return (
        !areaTecnicaStore.isFilterFilled ||
        !editalStore.isFilterFilled ||
        !projetoStore.isFilterFilled
    );
});
</script>


<template>
    <v-card elevation="10">
        <v-card-text class="position-relative">
            <p class="text-h4 text-10">
                Bem-vindo de volta! <br />
            </p>
            <br>
            <p class="text-h6 text-10"> Acesse o relatório completo da Área Técnica</p>
            <v-btn color="primary" class="mt-10 mb-2" :disabled="isDownloadDisabled" @click="VisualizaRelatorio">
                Baixar relatório completo
            </v-btn>
        </v-card-text>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="800px">
        <v-card>
            <v-card-title class="text-h5 text-center py-6">Relatório de acordo com o filtrado</v-card-title>
            <v-card-text>
                <!-- Exibe a imagem capturada -->
                <img v-if="capturedImage" :src="capturedImage" alt="Screenshot" class="w-full" />
                <p v-else>Carregando...</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                 <v-btn color="secondary" @click="expandImage">Expandir</v-btn>
                <v-btn color="primary" @click="dialogDelete = false">Fechar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>