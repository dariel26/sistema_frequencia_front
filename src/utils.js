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
    if (data === undefined) return;
    if (typeof data !== typeof new Date()) return;
    const ano = data?.getFullYear();
    const mes = String(data?.getMonth() + 1).padStart(2, '0');
    const dia = String(data?.getDate()).padStart(2, '0');

    return `${ano}/${mes}/${dia}`;
}

export function transformarStringAMDEmData(string) {
    if (string === undefined) return;
    if (string.length < 10) return;
    if (typeof string !== typeof String()) return;

    const ano = string?.substring(0, 4);
    const mes = string?.substring(5, 7);
    const dia = string?.substring(8, 10);
    if (isNaN(ano)) return;
    if (isNaN(mes)) return;
    if (isNaN(dia)) return;

    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
}

export function formatarDataDMA(data) {
    if (data === undefined) return;
    if (typeof data !== typeof new Date()) return;
    const ano = data?.getFullYear();
    const mes = String(data?.getMonth() + 1).padStart(2, '0');
    const dia = String(data?.getDate()).padStart(2, '0');

    return `${dia}/${mes}/${ano}`;
}

export function obterDatasPorDiaSemana(dataInicio, dataFim, diasSemana) {
    if (dataInicio === undefined) return [];
    if (dataFim === undefined) return [];
    if (diasSemana === undefined) return [];
    if (typeof dataInicio !== typeof new Date()) return [];
    if (typeof dataFim !== typeof new Date()) return [];

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

export function retornaArrayIndexDeIntervalo(intervalo) {
    const vetorIndex = [];
    const valorInicial = parseInt(intervalo.split(",")[0]);
    const valorFinal = parseInt(intervalo.split("-")[1]);
    if (isNaN(valorInicial) || isNaN(valorFinal)) return vetorIndex;
    for (let i = valorInicial - 1; i < valorFinal; i++) {
        vetorIndex.push(i);
    }
    return vetorIndex;
}

export function retornaSomenteDatasEntreIntervalo(data_inicial, data_final, datas) {
    const datasEntreIntervalo = [];
    datas?.forEach((d) => {
        if (d >= data_inicial && d <= data_final) datasEntreIntervalo.push(d);
    })
    return datasEntreIntervalo;
}

export function expandeArray(array, tamanho) {
    const arrayExpandido = [];

    for (let i = 0; i < tamanho; i++) {
        const index = i % array.length;
        arrayExpandido.push(array[index]);
    }

    return arrayExpandido;
}