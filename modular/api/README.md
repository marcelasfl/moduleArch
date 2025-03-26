# Módulo de API

Este módulo implementa uma camada de abstração para comunicação com APIs, utilizando padrões de design como Adapter, Factory e Interceptor para garantir flexibilidade, manutenibilidade e reutilização de código.

## Estrutura do Módulo

```
api/
├── adapters/          # Adaptadores para diferentes implementações de clientes HTTP
│   └── http/
│       └── axios.client.ts  # Implementação com Axios
├── factory/           # Fábricas para criação de objetos específicos
│   └── error.factory.ts     # Fábrica para padronização de erros
├── interceptors/      # Interceptores para processar requisições/respostas
│   ├── auth.interceptor.ts  # Adiciona tokens de autenticação
│   └── error.interceptor.ts # Processa erros de resposta
├── config.ts          # Configurações da API (URLs, timeouts)
├── interface.ts       # Interfaces que definem contratos do módulo
└── provider.ts        # Provedor que gerencia as dependências
```

## Como Funciona

### Provider

O `ApiProvider` é um singleton que centraliza a criação e fornecimento do cliente HTTP. Ele implementa:

- Padrão Singleton para garantir uma única instância do provedor
- Métodos para obter o cliente HTTP configurado
- Integração com o sistema de injeção de dependência do Vue

### Interface

Define os contratos que os clientes HTTP devem implementar:

- `HttpClientInterface`: Define métodos como `get`, `post`, `put` e `delete`

### Adapters

Implementações concretas dos clientes HTTP que seguem a interface definida:

- `AxiosHttpClient`: Implementação usando a biblioteca Axios
- Os adaptadores aplicam automaticamente os interceptores configurados

### Interceptors

Processam requisições antes de serem enviadas e respostas antes de serem entregues:

- `authInterceptor`: Adiciona o token de autenticação aos cabeçalhos das requisições
- `errorInterceptor`: Padroniza o tratamento de erros usando a factory de erros

### Factory

Cria objetos específicos seguindo padrões definidos:

- `errorFactory`: Cria objetos de erro padronizados baseados no código HTTP

### Configuração

O arquivo `config.ts` centraliza as configurações como URL base e timeout.

## Como Usar

### 1. Obtenção do Cliente HTTP

```typescript
import { apiProvider } from '@/api/provider';

// Obter o cliente HTTP
const httpClient = apiProvider.getHttpClient();

// Fazer uma requisição
const data = await httpClient.get('/endpoint');
```

### 2. Em Componentes Vue (usando provide/inject)

```typescript
import { useApiClient } from '@/api/provider';

// Em setup ou composable:
const httpClient = useApiClient();
const data = await httpClient.get('/endpoint');
```

### 3. Criando um Serviço Específico

```typescript
import { HttpClientInterface } from '@/api/interface';
import { apiProvider } from '@/api/provider';

export class MeuServico {
  private httpClient: HttpClientInterface;
  
  constructor() {
    // Obter cliente HTTP do provider
    this.httpClient = apiProvider.getHttpClient();
  }
  
  async buscarDados() {
    return this.httpClient.get('/meus-dados');
  }
}
```

## Extensibilidade

O módulo foi projetado para ser extensível:

1. Novos adaptadores podem ser adicionados implementando `HttpClientInterface`
2. Novos interceptores podem ser criados e aplicados ao cliente
3. Novas fábricas podem ser desenvolvidas para outros casos de uso

## Boas Práticas

1. Sempre use o provider para obter instâncias do cliente HTTP
2. Não crie instâncias diretas de adaptadores fora do provider
3. Para módulos específicos, crie interfaces e fábricas próprias que utilizem o cliente HTTP fornecido por este módulo 