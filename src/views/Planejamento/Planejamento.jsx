import { useContext } from "react";
import { useEffect, useState } from "react";
import CheckDias from "../../componentes/inputs/CheckDias";
import InputBotao from "../../componentes/inputs/InputBotao";
import InputChave from "../../componentes/inputs/InputChave";
import InputHora from "../../componentes/inputs/InputHora";
import InputNumero from "../../componentes/inputs/InputNumero";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";
import {
  corClaraRandomica,
  formatarDataAMD,
  formatarDataDMA,
  gerarChaveUnica,
  obterDatasPorDiaSemana,
  transformarStringAMDEmData,
} from "../../utils";
import InputSelecao from "../../componentes/inputs/InputSelecao";
import Calendario from "../../componentes/calendario/Calendario";

export default function Planejamento() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [preceptores, setPreceptores] = useState([]);
  const [estagios, setEstagios] = useState([]);

  const usuario = useContext(UsuarioContext);

  let menorData = transformarStringAMDEmData(
    estagios[0]?.grupos[0]?.data_inicial
  );
  let maiorData = transformarStringAMDEmData(
    estagios[0]?.grupos[0]?.data_inicial
  );
  estagios[0]?.grupos.forEach(({ data_inicial, data_final }) => {
    const dataI = transformarStringAMDEmData(data_inicial);
    const dataF = transformarStringAMDEmData(data_final);
    if (dataI < menorData) menorData = dataI;
    if (dataI > maiorData) maiorData = dataI;
    if (dataF < menorData) menorData = dataF;
    if (dataF > maiorData) maiorData = dataF;
  });
  const totalAlunos = alunos.length;

  useEffect(() => {
    const token = usuario.token;
    const p_alunos = apiSFE.listarAlunos(token);
    const p_preceptores = apiSFE.listarPreceptores(token);
    const p_estagios = apiSFE.listarEstagios(token);

    Promise.all([p_alunos, p_preceptores, p_estagios]).then((res) => {
      const alunos = res[0].data;
      const preceptores = res[1].data;
      const estagios = res[2].data;

      setPreceptores(preceptores);
      setAlunos(alunos);
      setEstagios(estagios);
    });
  }, [usuario]);

  const aoAlocarAtividade = (id_grupo, nome) => {
    const novasAtividades = atividades;
    novasAtividades.push({ id_grupo, nome });
    setAtividades(Object.assign([], novasAtividades));
  };

  return (
    <div className="row w-100 m-0 justify-content-center">
      <div className="col-sm-12 col-xl-8 mb-1">
        <span className="fs-5 fw-bold">Todos os alunos</span>
      </div>
      <div className="col-sm-12 col-xl-8 mb-2">
        <span className="ms-1">{"Total de alunos: " + totalAlunos}</span>
      </div>
      <div className="col-sm-12 col-xl-8 mb-2">
        <span className="ms-1">
          {"Intervalo: " +
            formatarDataDMA(menorData) +
            " - " +
            formatarDataDMA(maiorData)}
        </span>
      </div>
      {atividades.map((atividade) => (
        <div className="col-sm-12 col-xl-8 mb-2" key={gerarChaveUnica()}>
          <div className="ms-1">
            <Atividade
              key={gerarChaveUnica()}
              atividade={atividade}
              alunos={alunos}
              preceptores={preceptores}
              dataFinal={maiorData}
              dataInicial={menorData}
            />
          </div>
        </div>
      ))}
      <div className="col-sm-12 col-xl-8">
        <InputBotao
          className="ms-1"
          textoReferencia="Adicione uma atividade"
          aoClicar={(nome) => aoAlocarAtividade(null, nome)}
          maximaLargura={300}
        />
      </div>
    </div>
  );
}

function Atividade({ atividade, alunos, preceptores, dataInicial, dataFinal }) {
  const [intercalar, setIntercalar] = useState(false);
  const [temExecao, setTemExecao] = useState(false);
  const [datasExecao, setDatasExecao] = useState([]);
  const [datasEscolhidas, setDatasEscolhidas] = useState([]);

  const corClara = corClaraRandomica();

  const aoEscolherDataExecao = (data) => {
    let novasDatasEscolhidas = datasEscolhidas;
    let novasDatasExecao = datasExecao;

    const aDataEEscolhida = datasEscolhidas.findIndex(
      (d) => formatarDataAMD(d.start) === formatarDataAMD(data.date)
    );
    if(!aDataEEscolhida) return;
    
  };
  const aoEscolherDias = (dias) => {
    setDatasEscolhidas(
      obterDatasPorDiaSemana(dataInicial, dataFinal, dias)?.map((data) => ({
        allDay: true,
        start: data,
        end: data,
        display: "background",
        color: corClara,
      }))
    );
  };

  return (
    <div className="row w-100 m-0 justify-content-center border border-2 overflow-hidden rounded">
      <div className="col-sm-12 text-center">
        <span className="fw-bold">{atividade.nome}</span>
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
          aoSubmeter={(valor) => {
            console.log(valor);
          }}
          larguraMaxima={500}
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Dias da semana:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <CheckDias aoMudar={(dias) => aoEscolherDias(dias)} />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Hora inicial:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputHora
          textoReferencia="HH:MM"
          maximaLargura={150}
          textoBotao="Salvar"
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Hora final:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <InputHora
          textoReferencia="HH:MM"
          maximaLargura={150}
          textoBotao="Salvar"
        />
      </div>
      <div
        className={
          "row w-100 m-0 p-0 mb-2 " +
          (intercalar ? "border-top border-bottom" : "")
        }
      >
        <div>
          <span className="ms-1">Intercalar alunos</span>
        </div>
        <div className="col-sm-12">
          <InputChave aoMudar={setIntercalar} />
        </div>
        {intercalar ? (
          <>
            <div className="col-sm-12 mb-1">
              <span className="ms-1">{`Quantidade de alunos (1 - ${
                alunos.length - 1
              })`}</span>
            </div>
            <div className="col-sm-12 mb-2">
              <InputNumero
                numeroInicial={1}
                numeroMax={alunos.length - 1}
                maximaLargura={150}
                textoBotao="salvar"
              />
            </div>
          </>
        ) : undefined}
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
            eventos={datasExecao}
            aoClicarData={aoEscolherDataExecao}
          />
        </div>
      ) : undefined}

      <div className="mb-3" />
    </div>
  );
}
