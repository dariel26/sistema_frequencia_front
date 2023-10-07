const MANHA = "Manhã";
const TARDE = "Tarde";
const NOITE = "Noite";

export const DOMINGO = 0;
export const SEGUNDA = 1;
export const TERCA = 2;
export const QUARTA = 3;
export const QUINTA = 4;
export const SEXTA = 5;
export const SABADO = 6;

export const periodos = { MANHA, TARDE, NOITE };

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

export function sortDatas(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
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

export function dataEmAmd(data) {
  if (typeof data !== typeof new Date()) return;
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  return `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
}

export function dataEmDm(data) {
  if (typeof data !== typeof new Date()) return;
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  return `${dia < 10 ? "0" + dia : dia}/${mes < 10 ? "0" + mes : mes}`;
}

export function dataEmDmahm(date) {
  if (typeof date !== typeof new Date()) return;
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const ano = date.getFullYear();
  const hora = date.getHours();
  const minutos = date.getMinutes();
  return `${dia < 10 ? "0" + dia : dia}/${
    mes < 10 ? "0" + mes : mes
  }/${ano} - ${hora < 10 ? "0" + hora : hora}:${
    minutos < 10 ? "0" + minutos : minutos
  }`;
}

export function dataEmDma(date) {
  if (typeof date !== typeof new Date()) return;
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const ano = date.getFullYear();
  return `${dia < 10 ? "0" + dia : dia}/${mes < 10 ? "0" + mes : mes}/${ano}`;
}

export function filtraDatasPorIntervalo(data_inicial, data_final, datas) {
  const datasEntreIntervalo = [];
  datas?.forEach((d) => {
    if (d >= data_inicial && d <= data_final) datasEntreIntervalo.push(d);
  });
  return datasEntreIntervalo;
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

export function separaDatasEmSemanas(datas) {
  if (typeof datas !== typeof []) return [];
  if (datas.some((d) => typeof d !== typeof new Date())) return [];

  const datasSeparadasPorSemana = [[], []];
  const datasOrganizadas = datas.sort(sortDatas);
  const dataInicial = datasOrganizadas[0];
  const dataFinal = datasOrganizadas[datasOrganizadas.length - 1];
  const datasNoIntervalo = todasAsDatasNoIntervalo(dataInicial, dataFinal);

  let domingos = 0;
  for (const data of datasNoIntervalo) {
    if (datas.some((d) => dataEmDma(data) === dataEmDma(d))) {
      if (datasSeparadasPorSemana[domingos])
        datasSeparadasPorSemana[domingos].push(data);
      else {
        datasSeparadasPorSemana.push([]);
        datasSeparadasPorSemana[domingos].push(data);
      }
    }

    const diaDaSemana = data.getDay();
    if (diaDaSemana === DOMINGO) domingos += 1;
  }

  return datasSeparadasPorSemana.filter((semana) => semana.length > 0);
}

export function agruparDatasPorMes(datas) {
  const grupos = {};
  datas.forEach((data) => {
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

  const duracaoManha = calcularDuracao(
    inicio,
    fim,
    horaParaMinutos("00:00"),
    horaParaMinutos("11:59")
  );
  const duracaoTarde = calcularDuracao(
    inicio,
    fim,
    horaParaMinutos("12:00"),
    horaParaMinutos("17:59")
  );
  const duracaoNoite = calcularDuracao(
    inicio,
    fim,
    horaParaMinutos("18:00"),
    horaParaMinutos("23:59")
  );

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
  const [horas, minutos] = hora.split(":");
  return parseInt(horas) * 60 + parseInt(minutos);
}

export function comparaObjComDataInicial(objA, objB) {
  const dataA = objA.data_inicial;
  const dataB = objB.data_inicial;
  if (dataA < dataB) return -1;
  if (dataA > dataB) return 1;
  return 0;
}

export function diferencaAbsEmHoras(dataChegada, dataAtividade) {
  const milisegundos = dataAtividade.getTime() - dataChegada.getTime();
  const horas = milisegundos / (1000 * 60 * 60);
  return horas;
}

export function horarioEmData(data, horario) {
  const [hour, minute] = horario.split(":").map(Number);
  data.setHours(hour);
  data.setMinutes(minute);
  return data;
}
