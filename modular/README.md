# Boas Práticas para Código

## Princípios Importantes

### Evite `export default`
Use `export default` apenas em casos muito raros. Prefira exportações nomeadas, pois facilitam a rastreabilidade e importação de componentes específicos.

### Nomenclatura em Contextos

Não inclua o contexto em variáveis que já estão explicitamente dentro de um contexto. Isso torna o código mais limpo e evita redundância.

#### Exemplo - O que NÃO fazer:

```javascript
export const useSnackbarStore = defineStore('snackbar', () => {
  // ❌ Nomenclatura redundante com "snackbar" repetido
  const snackbarMessage = ref('');
  const snackbarColor = ref('success');
  const snackbarTimeout = ref(3000);
  
  function showSnackbarMessage(text, options) {
    // código...
  }
});
```

#### Exemplo - Forma correta:

```javascript
export const useSnackbarStore = defineStore('snackbar', () => {
  // ✅ Nomenclatura limpa sem redundância
  const message = ref('');
  const color = ref('success');
  const timeout = ref(3000);
  
  function show(text, options) {
    message.value = text;
    color.value = options?.color || 'success';
    timeout.value = options?.timeout || 3000;
    visible.value = true;
  }
  
  // ... restante do código
});
```

### Benefícios desta abordagem:
- **Código mais limpo**: Menos repetição e ruído visual
- **Melhor legibilidade**: Facilita a leitura e compreensão
- **Manutenção simplificada**: Menor verbosidade ao trabalhar com o código
- **Consistência**: Estabelece um padrão claro no projeto