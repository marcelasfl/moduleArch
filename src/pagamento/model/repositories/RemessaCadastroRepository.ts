import log from '@/logger';
import api from '@/services/api';
import RemessaCadastroRoutes from './apiRoutes/RemessaCadastro';

export default class FolhaRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createBaseRoute() {
    return new RemessaCadastroRoutes({}).entity;
  }

  createGenerateRemessaCadastroRoute() {
    return new RemessaCadastroRoutes({}).generate;
  }

  async generateRemessaCadastro(projetoId: string) {
    try {
      const generateRemessaCadastroRoute = this.createGenerateRemessaCadastroRoute();

      // Enviar a requisição e obter a resposta como Blob
      const response = await this.apiClient.post(
        generateRemessaCadastroRoute,
        { projetoId },
        {
          responseType: 'blob', // Indica que o retorno será um Blob
        }
      );

      // Criar um Blob com os dados retornados
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Extrair o nome do arquivo do cabeçalho Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded-file.txt'; // Nome padrão caso o cabeçalho não esteja presente

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8''|)(.+?)(['"]|;|$)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      // Criar uma URL temporária para o Blob
      const url = window.URL.createObjectURL(blob);

      // Criar o elemento <a> para forçar o download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);

      // Iniciar o download e limpar o link do DOM
      link.click();
      document.body.removeChild(link);

      // Liberar a URL gerada
      window.URL.revokeObjectURL(url);

      return response; // Caso queira retornar algum dado adicional
    } catch (error) {
      log.error("Erro ao gerar remessa cadastro", error);
      throw error;
    }
  }
}
