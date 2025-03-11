import { ref, onMounted, watchEffect, type Ref } from 'vue';

export class EntityManager<T extends { Id: string | number }> {
  items: Ref<T[]> = ref([]);
  dialog: Ref<boolean> = ref(false);
  itemEdit: Ref<T | null> = ref(null);
  loading: Ref<boolean> = ref(true);

  private store: any;
  private defaultItem: () => T;

  constructor(store: any, defaultItem: () => T) {
    this.store = store;
    this.defaultItem = defaultItem;

    // Buscar itens ao inicializar
    onMounted(async () => {
      await this.fetchItems();
      this.loading.value = false;
    });

    // Atualizar `items` ao observar `store.items`
    watchEffect(() => {
      this.items.value = this.store.items;
    });
  }

  // Método para abrir o diálogo de edição ou criação
  openDialog(item: T | null) {
    this.itemEdit.value = item ? { ...item } : this.defaultItem();
    this.dialog.value = true;
  }

  // Método para salvar o item (criar ou atualizar)
  async salvarItem(item: T) {
    this.loading.value = true;
    if (item.Id) {
      await this.store.updateItem(item.Id.toString(), item);
    } else {
      item.Id = Date.now().toString();
      await this.store.saveItem(item);
    }
    await this.fetchItems();
    this.dialog.value = false;
    this.loading.value = false;
  }

  // Método para remover o item
  async removerItem(id: string) {
    this.loading.value = true;
    await this.store.deleteItem(id);
    await this.fetchItems();
    this.loading.value = false;
  }

  // Método para buscar todos os itens
  async fetchItems() {
    await this.store.fetchItems('');
    this.items.value = this.store.items;
  }
}
