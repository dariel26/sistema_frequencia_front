import { utils, write } from 'xlsx';

export function gerarArquivoXLSX(dados) {

    const dadosPlanilha = [];
    const indexs = [];
    let contadorDeLinhas = -1;
    dados.forEach((linha) => {
        if (typeof linha[0] === typeof String()) {
            dadosPlanilha.push(linha);
            contadorDeLinhas += 1;
        }
        else {
            linha.forEach((dado, j) => {
                dadosPlanilha.push(dado);
                contadorDeLinhas += 1;
                if (dado[0] !== " ") {
                    indexs.push(contadorDeLinhas);
                }
            })
        }
    });

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dadosPlanilha, {origin: "A1"});
    utils.sheet_add_aoa(worksheet, dadosPlanilha, {origin: "A1"})

    if (!worksheet["!merges"]) worksheet["!merges"] = [];
    indexs.forEach((index) => {
        const intervalo = {
            s: { r: index, c: 0 },
            e: { r: index + 2, c: 0 }
        }
        worksheet["!merges"].push(intervalo);
    })


    utils.book_append_sheet(workbook, worksheet, 'Dados');

    const arquivoBinario = write(workbook, { type: 'binary' });

    const buffer = new ArrayBuffer(arquivoBinario.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < arquivoBinario.length; i++) {
        view[i] = arquivoBinario.charCodeAt(i) & 0xFF;
    }

    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'dados.xlsx';
    link.click();

    URL.revokeObjectURL(url);
}