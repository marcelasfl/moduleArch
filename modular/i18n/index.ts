import { createI18n } from 'vue-i18n';


// Importações base (Common)

import enUS from './locales/en-US.json';

import ptBR from './locales/pt-BR.json';


// Common

const messages = {

  'pt-BR': ptBR,

  'en-US': enUS,

};


// Função para registrar traduções de módulos

export function registerModuleTranslations(

  moduleName: string, 

  translations: Record<string, Record<string, any>>

) {

  Object.keys(translations).forEach(locale => {

    if (!messages[locale]) {

      messages[locale] = {};

    }

    // Adiciona traduções do módulo no namespace próprio

    messages[locale][moduleName] = translations[locale];

  });

}

export const i18n = createI18n({

  legacy: false, 

  messages,

  silentTranslationWarn: true,

  silentFallbackWarn: true

});