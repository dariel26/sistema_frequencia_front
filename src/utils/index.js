import { errors } from "./errors";
import obterCor from "./cores";
import {
  periodos,
  encontrarMinEMaxDatas,
  amdEmData,
  dataEmAmd,
  dataEmDm,
  dataEmDmahm,
  dataEmDma,
  filtraDatasPorIntervalo,
  obterDatasPorDiaSemana,
  todasAsDatasNoIntervalo,
  agruparDatasPorMes,
  obterPeriodoDoDia,
  comparaObjComDataInicial,
  diferencaAbsEmHoras,
  horarioEmData,
} from "./datas";
import { gerarArquivoXLSX } from "./xlsx";

export {
  errors,
  obterCor,
  periodos,
  encontrarMinEMaxDatas,
  amdEmData,
  dataEmAmd,
  dataEmDm,
  dataEmDmahm,
  dataEmDma,
  filtraDatasPorIntervalo,
  obterDatasPorDiaSemana,
  todasAsDatasNoIntervalo,
  agruparDatasPorMes,
  obterPeriodoDoDia,
  comparaObjComDataInicial,
  diferencaAbsEmHoras,
  horarioEmData,
  gerarArquivoXLSX,
};
