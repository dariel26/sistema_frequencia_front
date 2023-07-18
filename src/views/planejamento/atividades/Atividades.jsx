import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import CheckDias from "../../../componentes/inputs/CheckDias";
import InputBotao from "../../../componentes/inputs/InputBotao";
import { UsuarioContext } from "../../../filters/Usuario";
import apiSFE from "../../../service/api";
import { gerarChaveUnica, transformarStringAMDEmData } from "../../../utils";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import { CardRadiosBarraFixa } from "../../../components/cards/CardRadios";
import AtividadesEdicao from "./AtividadesEdicao";

export default function Atividades() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [estado, setEstado] = useState(0);
  const [editando, setEditando] = useState(false);

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
      const estagios = res[2].data.map((e) => ({
        ...e,
        grupos: e.grupos.map((g) => ({
          ...g,
          data_inicial: transformarStringAMDEmData(g.data_inicial),
          data_final: transformarStringAMDEmData(g.data_final),
        })),
      }));
      const atividades = res[4].data;

      setAlunos(alunos);
      setEstagios(estagios);
      setAtividades(atividades);
    });
  }, [usuario, estado, editando]);

  const aoEditar = () => {
    setEditando(!editando);
  };

  const aoAlocarAtividade = async (id_estagio, nome) => {
    try {
      await apiSFE.adicionarAtividades(usuario.token, [{ id_estagio, nome }]);
      setEstado(estado + 1);
    } catch (err) {
      alertaRef.current.addAlert(err);
    }
  };

  const totalAlunosEstagio = (estagio) => {
    let maiorNumero = 0;
    estagio.grupos.forEach((g) => {
      const total = g.alunos.length;
      maiorNumero = maiorNumero > total ? maiorNumero : total;
    });
    return maiorNumero;
  };

  return (
    <div className="row w-100 m-0 justify-content-center">
      <CardRadiosBarraFixa>
        <BotaoTexto
          aoClicar={aoEditar}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
          visivel
        />
      </CardRadiosBarraFixa>
      {!editando ? (
        gruposDeEstagios?.map((estagio) => (
          <div
            className="row w-100 m-0 p-0 justify-content-center mb-4"
            key={gerarChaveUnica()}
          >
            <div className="col-sm-12 col-xl-8 mb-1">
              <span className="fs-5 fw-bold">{estagio.nome_estagio}</span>
            </div>
            <div className="col-sm-12 col-xl-8 mb-2">
              <span className="ms-1">
                {"Total de alunos: " + totalAlunosEstagio(estagio)}
              </span>
            </div>
            {estagio.atividades.map((atividade) => (
              <div className="col-sm-12 col-xl-8 mb-2" key={gerarChaveUnica()}>
                <div className="ms-1">
                  <Atividade key={gerarChaveUnica()} atividade={atividade} />
                </div>
              </div>
            ))}
            <div className="col-sm-12 col-xl-8 mb-2 border-bottom border-primary border-4 pb-2">
              <InputBotao
                className="ms-1"
                textoReferencia="Adicione uma atividade"
                aoClicar={(nome) => aoAlocarAtividade(estagio.id_estagio, nome)}
                maximaLargura={300}
              />
            </div>
          </div>
        ))
      ) : (
        <AtividadesEdicao />
      )}
    </div>
  );
}

function Atividade({ atividade }) {
  const datasEscolhidas = atividade.datas.map((dataAtividade) => ({
    ...dataAtividade,
    data: transformarStringAMDEmData(dataAtividade.data),
  }));

  return (
    <div className="row w-100 m-0 justify-content-center border border-2 overflow-hidden rounded">
      <div className="col-sm-12 text-center">
        <span className="fw-bold fs-5">{atividade.nome_atividade}</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1 me-2">Preceptor:</span>
        <span> {atividade.nome_preceptor ?? "Nenhum"} </span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1 me-2">Local:</span>
        <span>{atividade.nome_local ?? "Nenhum"}</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Dias da semana:</span>
      </div>
      <div className="col-sm-12 mb-2">
        <CheckDias
          datasEscolhidas={datasEscolhidas.map((da) => da.data)}
          desabilitado
        />
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1 me-2">Hora inicial:</span>
        <span>{atividade.hora_inicial ?? "Não definido"}</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1 me-2">Hora final:</span>
        <span>{atividade.hora_final ?? "Não definido"}</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1 me-2">Alunos na atividade: </span>
        <span>[{atividade.intervalo_alunos ?? "Não definido"}]</span>
      </div>
      <div className="col-sm-12 mb-1">
        <span className="ms-1">Alunos por dia: </span>
        <span>{atividade.alunos_no_dia ?? "Não definido"}</span>
      </div>
      <div className="mb-3" />
    </div>
  );
}
