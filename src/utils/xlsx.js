import {utils, write} from 'xlsx';

export function gerarArquivoXLSX() {
  // Crie uma matriz com os dados que deseja escrever no arquivo XLSX
  const data = [
    ['Nome', 'Idade'],
    ['João', 25],
    ['Maria', 30],
    ['Pedro', 35]
  ];

  // Crie uma nova planilha
  const workbook = utils.book_new();

  // Crie uma nova planilha com os dados
  const worksheet = utils.aoa_to_sheet(data);

  // Adicione a planilha ao livro
  utils.book_append_sheet(workbook, worksheet, 'Dados');

  // Converta o livro para um arquivo binário
  const arquivoBinario = write(workbook, { type: 'binary' });

  // Crie um buffer a partir do arquivo binário
  const buffer = new ArrayBuffer(arquivoBinario.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < arquivoBinario.length; i++) {
    view[i] = arquivoBinario.charCodeAt(i) & 0xFF;
  }

  // Crie um blob a partir do buffer
  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  // Crie um URL temporário para o blob
  const url = URL.createObjectURL(blob);

  // Crie um link de download para o arquivo
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dados.xlsx';
  link.click();

  // Libere o URL temporário
  URL.revokeObjectURL(url);
}