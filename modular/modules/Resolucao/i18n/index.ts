import { registerModuleTranslations } from '../../../i18n';

// Importar todas as traduções do módulo
import ptBR from './locales/pt-BR.json';


// Criar objeto com todas as traduções do módulo
const translations = {
  'pt-BR': ptBR,
};

// Registrar traduções no i18n global
registerModuleTranslations('resolution', translations);

export default translations;