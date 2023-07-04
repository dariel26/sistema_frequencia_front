import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import CheckDias from "../../componentes/inputs/CheckDias";
import InputChave from "../../componentes/inputs/InputChave";
import InputHora from "../../componentes/inputs/InputHora";
import InputNumero from "../../componentes/inputs/InputNumero";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";
import {
  expandeArray,
  formatarDataAMD,
  gerarChaveUnica,
  obterDatasPorDiaSemana,
  retornaArrayIndexDeIntervalo,
  retornaSomenteDatasEntreIntervalo,
  transformarStringAMDEmData,
} from "../../utils";
import InputSelecao from "../../componentes/inputs/InputSelecao";
import Calendario from "../../componentes/calendario/Calendario";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { AlertaContext } from "../../filters/alert/Alert";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import InputIntervalo from "../../componentes/inputs/InputIntervalo";

export default function AtividadesEdicao() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [preceptores, setPreceptores] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [locais, setLocais] = useState([]);
  const [estado, setEstado] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  let menorData = estagios[0]?.grupos[0]?.data_inicial;
  let maiorData = estagios[0]?.grupos[0]?.data_inicial;

  estagios[0]?.grupos.forEach(({ data_inicial, data_final }) => {
    if (data_inicial < menorData) menorData = data_inicial;
    if (data_inicial > maiorData) maiorData = data_inicial;
    if (data_final < menorData) menorData = data_final;
    if (data_final > maiorData) maiorData = data_final;
  });

  const atividadesGerais = atividades.filter((a) => a.id_estagio === null);
  const gruposDeEstagios = [
    {
      nome_estagio: "Geral",
      id_estagio: null,
      grupos: [
        {
          nome: "Todos os alunos",
          alunos,
          data_inicial: menorData,
          data_final: maiorData,
        },
      ],
      atividades: atividadesGerais,
    },
  ].concat(estagios);

  useEffect(() => {
    const token = usuario.token;
    const p_alunos = apiSFE.listarAlunos(token);
    const p_preceptores = apiSFE.listarPreceptores(token);
    const p_estagios = apiSFE.listarEstagios(token);
    const p_grupos = apiSFE.listarGrupos(token);
    const p_atividades = apiSFE.listarAtividades(token);
    const p_locais = apiSFE.listarLocais(token);

    Promise.all([
      p_alunos,
      p_preceptores,
      p_estagios,
      p_grupos,
      p_atividades,
      p_locais,
    ]).then((res) => {
      const alunos = res[0].data;
      const preceptores = res[1].data;
      const estagios = res[2].data.map((e) => ({
        ...e,
        grupos: e.grupos.map((g) => ({
          ...g,
          data_inicial: transformarStringAMDEmData(g.data_inicial),
          data_final: transformarStringAMDEmData(g.data_final),
        })),
      }));
      const atividades = res[4].data;
      const locais = res[5].data;

      setLocais(locais);
      setPreceptores(preceptores);
      setAlunos(alunos);
      setEstagios(estagios);
      setAtividades(atividades);
    });
  }, [usuario, estado]);

  const aoDesalocarAtividade = async (atividade) => {
    try {
      await apiSFE.deletarAtividades(usuario.token, [atividade.id_atividade]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const gruposComDiferentesQuantidades = (estagio) => {
    const quantidadeInicial = estagio.grupos[0].alunos.length;
    const blQuantidadesDiferentes = estagio.grupos.some(
      ({ alunos }) => alunos.length !== quantidadeInicial
    );
    return blQuantidadesDiferentes;
  };

  const totalAlunosEstagio = (estagio) => {
    let maiorNumero = 0;
    estagio.grupos.forEach((g) => {
      const total = g.alunos.length;
      maiorNumero = maiorNumero > total ? maiorNumero : total;
    });
    return maiorNumero;
  };

  const aoAlocarPreceptor = async ({ id_preceptor, id_atividade }) => {
    try {
      await apiSFE.adicionarPreceptoresAAtividades(usuario.token, [
        { id_preceptor, id_atividade },
      ]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoAlocarLocal = async ({ id_local, id_atividade }) => {
    try {
      await apiSFE.adicionarLocaisAAtividades(usuario.token, [
        { id_local, id_atividade },
      ]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoSalvarHoraInicial = async ({ id_atividade, hora_inicial }) => {
    try {
      await apiSFE.editarAtividades(usuario.token, [
        { id_atividade, hora_inicial },
      ]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoSalvarHoraFinal = async ({ id_atividade, hora_final }) => {
    try {
      await apiSFE.editarAtividades(usuario.token, [
        { id_atividade, hora_final },
      ]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoAdicionarDatas = async ({ id_atividade, datas }) => {
    try {
      const dados = datas.map((data) => ({ id_atividade, data }));
      await apiSFE.adicionarDatasAAtividade(usuario.token, dados);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoEditarData = async ({ id_dataatividade, excluida }) => {
    try {
      await apiSFE.editarDatasDeAtividade(usuario.token, [
        { id_dataatividade, excluida },
      ]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const aoEditarAlunosNaAtividade = async (
    atividade,
    { novoIntervalo, novoAlunosNoDia }
  ) => {
    try {
      const id_atividade = atividade.id_atividade;
      const intervalo_alunos = novoIntervalo ?? atividade.intervalo_alunos;
      const alunos_no_dia = novoAlunosNoDia ?? atividade.alunos_no_dia;
      const indexGE = gruposDeEstagios.findIndex((e) =>
        e.atividades.some((a) => a.id_atividade === id_atividade)
      );
      let alunosDatasAgrupados = gruposDeEstagios[indexGE].grupos.map(
        ({ data_inicial, data_final, alunos }) => ({
          data_inicial,
          data_final,
          alunos,
        })
      );
      const dadosAtividade = [
        { id_atividade, intervalo_alunos, alunos_no_dia },
      ];
      const arrayIndex = retornaArrayIndexDeIntervalo(intervalo_alunos);

      alunosDatasAgrupados = alunosDatasAgrupados.map((ada) => {
        const alunosNoDia =
          alunos_no_dia === null || alunos_no_dia > ada.alunos.length
            ? ada.alunos.length
            : alunos_no_dia;
        const data_inicial = ada.data_inicial;
        const data_final = ada.data_final;
        let datas = atividade.datas.map(({ id_dataatividade, data }) => ({
          id_dataatividade,
          data: transformarStringAMDEmData(data),
        }));
        const datasNoIntervalo = retornaSomenteDatasEntreIntervalo(
          data_inicial,
          data_final,
          datas.map(({ data }) => data)
        );

        datas = datasNoIntervalo.map((d) => datas.find((od) => od.data === d));
        const alunos = ada.alunos.filter((_, i) => arrayIndex.includes(i));
        return {
          alunos: expandeArray(alunos, alunosNoDia * datas.length),
          datas,
        };
      });

      let alunosEDatas = [];
      alunosDatasAgrupados.forEach(({ datas, alunos }) => {
        const alunosNoDia =
          alunos_no_dia === null || alunos_no_dia > alunos.length
            ? alunos.length
            : alunos_no_dia;
        datas.forEach((data, i) => {
          alunos
            .slice(i * alunosNoDia, i * alunosNoDia + alunosNoDia)
            .forEach((a) =>
              alunosEDatas.push({
                id_dataatividade: data.id_dataatividade,
                id_aluno: a.id_aluno,
              })
            );
        });
      });

      await apiSFE.editarAtividades(usuario.token, dadosAtividade);
      if (alunosEDatas.length > 0 && alunos_no_dia && intervalo_alunos)
        await apiSFE.adicionarAlunoADataAtividade(usuario.token, alunosEDatas);

      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  return (
    <>
      {gruposDeEstagios?.map((estagio) => (
        <div
          className="row w-100 m-0 p-0 justify-content-center mb-4 border-bottom border-4 border-primary"
          key={gerarChaveUnica()}
        >
          <div className="col-sm-12 col-xl-8 mb-1">
            <span className="fs-5 fw-bold">{estagio.nome_estagio}</span>
          </div>
          <div className="col-sm-12 col-xl-8 mb-2">
            <span className="ms-1">
              {"Total de alunos: " + totalAlunosEstagio(estagio)}
            </span>
            {gruposComDiferentesQuantidades(estagio) ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip">
                    Existem grupos com menor quantidade de alunos
                  </Tooltip>
                }
              >
                <label role="button" className="ms-2 text-danger">
                  <BsFillPatchQuestionFill />
                </label>
              </OverlayTrigger>
            ) : undefined}
          </div>
          {estagio.atividades.map((atividade) => (
            <div className="col-sm-12 col-xl-8 mb-2" key={gerarChaveUnica()}>
              <div className="ms-1">
                <Atividade
                  key={gerarChaveUnica()}
                  atividade={atividade}
                  alunos={alunos}
                  locais={locais}
                  preceptores={preceptores}
                  dataFinal={maiorData}
                  dataInicial={menorData}
                  aoDesalocarAtividade={aoDesalocarAtividade}
                  aoAlocarPreceptor={aoAlocarPreceptor}
                  aoSalvarHoraFinal={aoSalvarHoraFinal}
                  aoSalvarHoraInicial={aoSalvarHoraInicial}
                  aoAdicionarDatas={aoAdicionarDatas}
                  aoEditarData={aoEditarData}
                  aoEditarAlunosNaAtividade={aoEditarAlunosNaAtividade}
                  aoAlocarLocal={aoAlocarLocal}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Atividade({
  atividade,
  alunos,
  locais,
  preceptores,
  dataInicial,
  dataFinal,
  aoDesalocarAtividade,
  aoAlocarPreceptor,
  aoSalvarHoraInicial,
  aoSalvarHoraFinal,
  aoAdicionarDatas,
  aoEditarData,
  aoEditarAlunosNaAtividade,
  aoAlocarLocal,
}) {
  const [temExecao, setTemExecao] = useState(false);

  const datasEscolhidas = atividade.datas.map((dataAtividade) => ({
    ...dataAtividade,
    data: transformarStringAMDEmData(dataAtividade.data),
  }));

  const menorValor = parseInt(atividade.intervalo_alunos?.split("-")[0] ?? 0);
  const maiorValor = parseInt(atividade.intervalo_alunos?.split("-")[1] ?? 0);

  const corEscolhida = "#48E866";
  const corAnulada = "#E84862";
  const eventos = datasEscolhidas?.map(({ data, excluida }) => ({
    allDay: true,
    start: data,
    end: data,
    display: "background",
    color: excluida ? corAnulada : corEscolhida,
  }));

  const aoEscolherDataExecao = (data) => {
    const dataModificada = datasEscolhidas.find(
      (d) => formatarDataAMD(d.data) === formatarDataAMD(data.date)
    );
    if (dataModificada === undefined) return;
    const excluida = !dataModificada.excluida;
    aoEditarData({
      id_dataatividade: dataModificada.id_dataatividade,
      excluida,
    });
  };
  const aoEscolherDias = (dias) => {
    const datas = obterDatasPorDiaSemana(dataInicial, dataFinal, dias).map(
      (data) => data
    );
    return aoAdicionarDatas({ id_atividade: atividade.id_atividade, datas });
  };

  return (
    <div className="row w-100 m-0 justify-content-center border border-2 overflow-hidden rounded">
      <div className="col-sm-12 text-end">
        <BotaoTexto
          assincrono
          texto="Deletar"
          aoClicar={() => aoDesalocarAtividade(atividade)}
          visivel={true}
        />
      </div>
      <div className="col-sm-12 text-center">
        <span className="fw-bold fs-5">{atividade.nome_atividade}</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Preceptor:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputSelecao
          titulo="Preceptor"
          textoReferencia="Escolha o preceptor"
          campoSelecao="nome"
          opcoesSelecao={preceptores}
          textoBotao="Alocar"
          aoSubmeter={({ id_preceptor }) =>
            aoAlocarPreceptor({
              id_preceptor,
              id_atividade: atividade.id_atividade,
            })
          }
          textoInicial={atividade.nome_preceptor ?? ""}
          larguraMaxima={500}
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Local:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputSelecao
          titulo="Local"
          textoReferencia="Escolha o local"
          campoSelecao="nome"
          opcoesSelecao={locais}
          textoBotao="Alocar"
          aoSubmeter={({ id_local }) =>
            aoAlocarLocal({
              id_local,
              id_atividade: atividade.id_atividade,
            })
          }
          textoInicial={atividade.nome_local ?? ""}
          larguraMaxima={500}
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Dias da semana:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <CheckDias
          aoMudar={(dias) => aoEscolherDias(dias)}
          datasEscolhidas={datasEscolhidas.map((da) => da.data)}
          id={atividade.id_atividade}
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Hora inicial:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputHora
          textoInicial={atividade.hora_inicial ?? ""}
          textoReferencia="HH:MM"
          maximaLargura={150}
          textoBotao="Salvar"
          aoClicar={(hora_inicial) =>
            aoSalvarHoraInicial({
              id_atividade: atividade.id_atividade,
              hora_inicial,
            })
          }
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Hora final:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputHora
          textoInicial={atividade.hora_final ?? ""}
          textoReferencia="HH:MM"
          maximaLargura={150}
          textoBotao="Salvar"
          aoClicar={(hora_final) =>
            aoSalvarHoraFinal({
              id_atividade: atividade.id_atividade,
              hora_final,
            })
          }
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Alunos na atividade</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputIntervalo
          aoClicar={(novoIntervalo) =>
            aoEditarAlunosNaAtividade(atividade, {
              novoIntervalo,
            })
          }
          textoInicial={atividade.intervalo_alunos ?? "Não definido"}
          maximaLargura={220}
          maximoValor={alunos.length}
          textoBotao="Salvar"
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">{`Alunos por dia (Max ${
          maiorValor - menorValor
        })`}</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputNumero
          numeroInicial={1}
          numeroMax={alunos.length}
          maximaLargura={220}
          textoBotao="Salvar"
          textoInicial={atividade.alunos_no_dia ?? "Não definido"}
          aoClicar={(novoAlunosNoDia) =>
            aoEditarAlunosNaAtividade(atividade, {
              novoAlunosNoDia,
            })
          }
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Escolher datas de exeção</span>
      </div>
      <div className="col-sm-12">
        <InputChave aoMudar={setTemExecao} />
      </div>
      {temExecao ? (
        <div className="col-sm-12 mb-2">
          <Calendario
            altura={500}
            eventos={eventos}
            aoClicarData={aoEscolherDataExecao}
          />
        </div>
      ) : undefined}

      <div className="mb-3" />
    </div>
  );
}
