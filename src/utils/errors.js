function filtraMensagem(error) {
  return (
    error?.response?.data?.message ?? error?.message ?? "Erro desconhecido"
  );
}

export const errors = { filtraMensagem };
