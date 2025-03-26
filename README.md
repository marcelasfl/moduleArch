# 📁 Explicação da Estrutura  

Atualmente, nossa arquitetura se concentra em ser **Modular**, ou seja, trabalha com módulos. É necessário termos uma parte global, onde abrange tudo que será comum entre os módulos, e a parte mais específica do nosso código (dentro dos módulos).  

---

## 🌍 Parte Global  

A camada global se concentra nas regras de negócio reutilizáveis e componentes compartilhados entre módulos.  

### **Principais elementos da parte global:**  

#### **1. Api - Entity e Factory:**  
- Responsáveis pela criação e manipulação de entidades.  
- Utilizam o `ApiError` para gerenciar erros comuns, como **404** (não encontrado) e **500** (erro interno), permitindo um controle mais refinado das falhas.  

#### **2. Api - apiProvider:**  
- Gerencia o **token de autenticação** do usuário e injeta a API nos módulos necessários.  
- Centraliza a comunicação com o backend e facilita a integração entre diferentes partes do sistema.  

#### **3. Componentes globais:**  
- Inclui elementos reutilizáveis que aparecem em várias partes da aplicação, como **Snackbar**, **dialogs** e **navmenu**.  

---

## 🛠️ Módulos  

Cada funcionalidade do sistema é organizada em um módulo separado, seguindo a estrutura abaixo:  

### **1. View**  
- A **View** representa a página em si — a parte visual renderizada para o usuário.  
- Deve ser **leve e enxuta**, contendo o mínimo possível de regras de negócio.  

✅ **Boas práticas:**  
- Focar apenas em **estrutura e chamada de componentes**.  
- A lógica deve ser delegada para **composables** e **services**.  
- A parte de **UI** deve ser configurada nos **components**.  

---

### **2. Components**  
Os **components** são responsáveis pela **interface visual (UI)**. Eles contêm principalmente o **HTML** e **CSS** da aplicação, garantindo a reutilização de elementos visuais entre diferentes views.  

🔹 **Exemplos:**  
- Card de usuário  
- Botão customizado  
- Tabela de dados  

👉 **Regra de ouro:**  
- Components **não devem conter regras de negócio ou chamadas de API** — só UI.  

---

### **3. Router**  
Gerencia as **rotas específicas** do módulo. Define os caminhos, parâmetros e redirecionamentos necessários para navegar dentro do módulo.  

**Exemplo de estrutura de rota:**  
```javascript
{
  path: '/projetos',
  component: () => import('@/modules/projetos/ProjectsView.vue')
}
