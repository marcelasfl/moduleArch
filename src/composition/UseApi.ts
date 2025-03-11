import api from '../services/api'

export default function useApi(url: string) {
  const list = async () => {
    const { data } = await api.get(url)
    return data
  }

  const getById = async (id?: string) => {
    if (id){
      const response = await api.get(`${url}/${id}`)
      return response.data
    }
    const response = await api.get(`${url}`)
    return response.data
  }

  const post = async<T=Record<string, any>> (form: T) => {
    const { data } = await api.post(url, form)
    return data
  }

  const update = async <T = Record<string, any>>(form: { id: T } | { editaisIds: string[]; areaTecnicaId: string }) => {
    const hasId = (obj: any): obj is { id: T } => 'id' in obj;

    const { data } = await api.put(`${url}/${hasId(form) ? form.id : ''}`, form);
    
    return data
  }
  

  const remove = async (id: string) => {
    const { data } = await api.delete(`${url}/${id}`)
    return data
  }

  const activate = async (id: string) => {
    const { data } = await api.put(`${url}/${id}/ativar`)
    return data
  }

  const desactive = async (id: string) => {
    const { data } = await api.put(`modalidadebolsa/modalidadebolsa/${id}/desativar`)
    return data
  }

  return {
    list,
    post,
    update,
    remove,
    getById,
    activate,
    desactive
  }
}
