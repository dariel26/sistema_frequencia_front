const MANHA = "Manhã";
const TARDE = "Tarde";
const NOITE = "Noite";

export const periodos = { MANHA, TARDE, NOITE }

export function encontrarMinEMaxDatas(datas) {
    if (!Array.isArray(datas) || datas.length === 0) {
        return [];
    }

    let dataMinima = datas[0];
    let dataMaxima = datas[0];

    for (let i = 1; i < datas.length; i++) {
        if (datas[i] < dataMinima) {
            dataMinima = datas[i];
        }
        if (datas[i] > dataMaxima) {
            dataMaxima = datas[i];
        }
    }

    return [dataMinima, dataMaxima];
}

export function amdEmData(string) {
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

export function filtraDatasPorIntervalo(data_inicial, data_final, datas) {
    const datasEntreIntervalo = [];
    datas?.forEach((d) => {
        if (d >= data_inicial && d <= data_final) datasEntreIntervalo.push(d);
    })
    return datasEntreIntervalo;
}

export function todasAsDatasNoIntervalo(dataInicio, dataFim) {
    const diasSemana = [0, 1, 2, 3, 4, 5, 6];
    if (dataInicio === undefined) return [];
    if (dataFim === undefined) return [];
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

export function agruparDatasPorMes(datas) {
    const grupos = {};
    datas.forEach(data => {
        const mes = data.getMonth();
        if (!grupos[mes]) {
            grupos[mes] = [];
        }
        grupos[mes].push(data);
    });

    const arraysPorMes = Object.values(grupos);
    return arraysPorMes;
}

export function obterPeriodoDoDia(horaInicial, horaFinal) {
    const inicio = horaParaMinutos(horaInicial);
    const fim = horaParaMinutos(horaFinal);
  
    const duracaoManha = calcularDuracao(inicio, fim, horaParaMinutos("00:00"), horaParaMinutos("11:59"));
    const duracaoTarde = calcularDuracao(inicio, fim, horaParaMinutos("12:00"), horaParaMinutos("17:59"));
    const duracaoNoite = calcularDuracao(inicio, fim, horaParaMinutos("18:00"), horaParaMinutos("23:59"));
  
    if (duracaoManha >= duracaoTarde && duracaoManha >= duracaoNoite) {
      return MANHA;
    } else if (duracaoTarde >= duracaoManha && duracaoTarde >= duracaoNoite) {
      return TARDE;
    } else {
      return NOITE;
    }
  }
  
  function calcularDuracao(inicio, fim, periodoInicio, periodoFim) {
    if (inicio <= periodoFim && fim >= periodoInicio) {
      return Math.min(fim, periodoFim) - Math.max(inicio, periodoInicio);
    } else {
      return 0;
    }
  }
  
  function horaParaMinutos(hora) {
    const [horas, minutos] = hora.split(':');
    return parseInt(horas) * 60 + parseInt(minutos);
  }
