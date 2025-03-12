
const validarNumero = (numero: number | null) => {
  return numero !== null && numero > 0 ? true : 'Número inválido';
};

const validarData = (data: string) => {
  return data ? true : 'Data de publicação é obrigatória';
};

const validarEmenta = (ementa: string) => {
  return ementa.length > 0 && ementa.length <= 500 ? true : 'Ementa deve ter entre 1 e 500 caracteres';
};

// const validarLink = (link: string) => {
//   return /^https:\/\/fapes\.es\.gov\.br/.test(link) ? true : 'O link deve ser do domínio da Fapes';
// };

const validarNumRastreioEdocs = (num: string) => {
  return num.length > 0 ? true : 'O número do E-Docs é obrigatório';
};

export function useValidacao() {
  
  return {
    validarNumero,
    validarData,
    validarEmenta,
    // validarLink,
    validarNumRastreioEdocs
  };
}
