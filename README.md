# Projeto leds-conectafapes-frontend-admin #

## Requisitos ##
- Node.js (versão recomendada: 18.x)
- NPM
- Docker e Docker Compose (opcional, para ambiente conteinerizado)

## Instalação ##
```sh
npm install
```

## Execução ##

### Ambiente de Desenvolvimento ###
```sh
npm run dev
```

### Ambiente de Produção ###
```sh
npm run build
npm run preview
```

### Execução com Docker ###
```sh
docker-compose up --build
```

## Acesso com token ##
Para acessar localmente, sem acesso à API de login, deve-se adicionar o authToken de acesso no LocalStorage.
```
authToken: '<token de acesso>'
```
Para conseguir um authToken válido, procure alguém da equipe de Desenvolvimento ou DevOps.

## Comunicação front - back ##
Para acessar certas funcionalidades do frontend, precisa estar utilizando repositórios específicos do backend:

```
Funcionalidades do módulo de dashboard: leds-conectafapes-backend-dashboard
Funcionalidades do módulo de pagamento: leds-conectafapes-backend-pagamento-bolsistas
Funcionalidades do módulo de cadastro de bolsa: leds-conectafapes-backend-admin
```