## Configuração de Traduções para um Módulo

i18n da Aplicação:

```typescript
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
  legacy: false, // Use Composition API
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
});
```


### Arquivo de registro de traduções por módulo
Cada módulo teria um arquivo index.ts para registrar suas traduções:

```typescript
modules/Auth/i18n/index.ts:


import { registerModuleTranslations } from '@/i18n';

// Importar todas as traduções do módulo
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import es from './locales/es.json';

// Criar objeto com todas as traduções do módulo
const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es': es
};

// Registrar traduções no i18n global
registerModuleTranslations('auth', translations);

export default translations;
```


## Configuração no Arquivo Principal (main.ts)

Importe os módulos de tradução no arquivo principal da aplicação:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './i18n';

// Importa as traduções dos módulos
import '@/modules/Auth/i18n';
// Outros módulos...

const app = createApp(App);
app.use(i18n);
// Outras configurações...
app.mount('#app');
```

## Uso nos Componentes

### No Template

```vue
<template>
  <div>
    <h1>{{ $t('auth.login.title') }}</h1>
    <form @submit.prevent="onSubmit">
      <label>{{ $t('auth.login.username') }}</label>
      <input v-model="username" type="text" />
      <label>{{ $t('auth.login.password') }}</label>
      <input v-model="password" type="password" />
      <button type="submit">{{ $t('auth.login.submit') }}</button>
    </form>
  </div>
</template>
```

### No Script

```vue
<script setup>
import { useI18n } from 'vue-i18n';
// Acesso às traduções via Composition API
const { t } = useI18n();
// Para definir um escopo específico para o módulo
const { t: tAuth } = useI18n({ inheritLocale: true, useScope: 'global' });
// Exemplo de uso
console.log(tAuth('auth.login.title'));
</script>
```
```