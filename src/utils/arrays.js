export function extenderArray(array, tamanho) {
  const arrayExtendido = [];

  for (let i = 0; i < tamanho; i++) {
    const originalIndex = i % array.length;
    arrayExtendido.push(array[originalIndex]);
  }

  return arrayExtendido.filter((a) => a);
}

export function moverParaPrimeiraPosicao(array, valor) {
  const index = array.indexOf(valor);

  if (index !== -1) {
    return array.slice(index).concat(array.slice(0, index));
  } else {
    return array;
  }
}
