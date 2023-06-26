export function corClaraRandomica() {
    var r = Math.floor(Math.random() * 56) + 200;
    var g = Math.floor(Math.random() * 56) + 200;
    var b = Math.floor(Math.random() * 56) + 200;

    var ajuste = Math.floor(Math.random() * 56);
    r -= ajuste;
    g -= ajuste;
    b -= ajuste;

    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);

    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

export function gerarChaveUnica() {
    const timestamp = Date.now().toString();
    const randomNum = Math.random().toString(36).substring(2, 5);

    return `${timestamp}-${randomNum}`;
}

export function formatarDataAMD(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}/${mes}/${dia}`;
}

export function transformarStringAMDEmData(string) {
    if (string === undefined) return;
    if (string.length < 10) return;
    const ano = string.substring(0, 4);
    const mes = string.substring(5, 7);
    const dia = string.substring(8, 10);
    if (isNaN(ano)) return;
    if (isNaN(mes)) return;
    if (isNaN(dia)) return;

    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}

export function formatarDataDMA(data) {
    if (data === undefined) return;

    const ano = data?.getFullYear();
    const mes = String(data?.getMonth() + 1).padStart(2, '0');
    const dia = String(data?.getDate()).padStart(2, '0');

    return `${dia}/${mes}/${ano}`;
}

export function obterDatasPorDiaSemana(dataInicio, dataFim, diasSemana) {
    if (dataInicio === undefined) return [];
    if (dataFim === undefined) return [];
    if (diasSemana === undefined) return [];

    var datas = [];
    var dataAtual = new Date(dataInicio);

    while (dataAtual <= dataFim) {
        var diaSemanaAtual = dataAtual?.getDay();

        if (diasSemana?.includes(diaSemanaAtual)) {
            datas.push(new Date(dataAtual));
        }

        dataAtual?.setDate(dataAtual?.getDate() + 1);
    }

    return datas;
}