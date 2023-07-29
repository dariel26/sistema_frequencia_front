import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import InputBotao from "../../../componentes/inputs/InputBotao";
import { UsuarioContext } from "../../../filters/Usuario";
import apiSFE from "../../../service/api";
import { gerarChaveUnica, transformarStringAMDEmData } from "../../../utils";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import { CardRadiosBarraFixa } from "../../../components/cards/CardRadios";
import AtividadesEdicao from "./AtividadesEdicao";
import uuid from "react-uuid";
import { CardAtividade } from "../../../componentes";

export default function Atividades() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [preceptores, setPreceptores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [editando, setEditando] = useState(false);

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  let dataInicialSemestre = estagios[0]?.grupos[0]?.data_inicial;
  let dataFinalSemestre = estagios[0]?.grupos[0]?.data_inicial;

  estagios[0]?.grupos.forEach(({ data_inicial, data_final }) => {
    if (data_inicial < dataInicialSemestre) dataInicialSemestre = data_inicial;
    if (data_inicial > dataFinalSemestre) dataFinalSemestre = data_inicial;
    if (data_final < dataInicialSemestre) dataInicialSemestre = data_final;
    if (data_final > dataFinalSemestre) dataFinalSemestre = data_final;
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
          data_inicial: dataInicialSemestre,
          data_final: dataFinalSemestre,
        },
      ],
      atividades: atividadesGerais,
    },
  ].concat(estagios);

  useEffect(() => {
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
    ])
      .then((res) => {
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
        setLocais(res[5].data);
        setPreceptores(res[1].data);
        setAlunos(alunos);
        setEstagios(estagios);
        setAtividades(atividades);
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [token, editando, alerta]);

  const aoEditar = () => {
    setEditando(!editando);
  };

  const aoAlocarAtividade = async (id_estagio, nome) => {
    try {
      const novasAtividades = (
        await apiSFE.adicionarAtividades(token, [{ id_estagio, nome }])
      ).data;
      const estagiosAtualizados = (await apiSFE.listarEstagios(token)).data;
      setAtividades(novasAtividades);
      setEstagios(estagiosAtualizados);
    } catch (err) {
      throw err;
    }
  };

  const aoDeletarAtividade = async ({ id_atividade }) => {
    try {
      await apiSFE.deletarAtividades(token, [id_atividade]);
      setAtividades((existentes) =>
        existentes.filter((a) => a.id_atividade !== id_atividade)
      );
      setEstagios((existentes) =>
        existentes.map((estagio) => {
          if (!estagio.atividades.some((a) => a.id_atividade === id_atividade))
            return estagio;
          return {
            ...estagio,
            atividades: estagio.atividades.filter(
              (a) => a.id_atividade !== id_atividade
            ),
          };
        })
      );
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarPreceptor = async ({ id_preceptor, id_atividade }) => {
    try {
      await apiSFE.adicionarPreceptoresAAtividades(token, [
        { id_preceptor, id_atividade },
      ]);
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarLocal = async ({ id_local, id_atividade }) => {
    try {
      await apiSFE.adicionarLocaisAAtividades(token, [
        { id_local, id_atividade },
      ]);
    } catch (err) {
      throw err;
    }
  };

  const aoAdicionarDatas = async ({ datas, id_atividade }) => {
    try {
      await apiSFE.adicionarDatasAAtividade(token, datas, id_atividade);
      const atividadesAtualizadas = await apiSFE.listarAtividades(token);
      return atividadesAtualizadas.data.find(
        (a) => a.id_atividade === id_atividade
      );
    } catch (err) {
      throw err;
    }
  };

  const aoEditarAtividade = async (dado) => {
    try {
      return await apiSFE.editarAtividades(token, [dado]);
    } catch (err) {
      throw err;
    }
  };

  const aoEditarDataDeAtividade = async (dado) => {
    try {
      await apiSFE.editarDatasDeAtividade(token, [dado]);
    } catch (err) {
      throw err;
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
              <div className="col-sm-12 col-xl-8 mb-2" key={uuid()}>
                <div className="ms-1">
                  <CardAtividade
                    key={gerarChaveUnica()}
                    atividade={atividades.find(
                      (a) => a.id_atividade === atividade.id_atividade
                    )}
                    dataInicial={dataInicialSemestre}
                    dataFinal={dataFinalSemestre}
                    preceptores={preceptores}
                    locais={locais}
                    aoAlocarPreceptor={aoAlocarPreceptor}
                    aoAlocarLocal={aoAlocarLocal}
                    aoDeletarAtividade={aoDeletarAtividade}
                    aoAdicionarDatas={aoAdicionarDatas}
                    aoEditarAtividade={aoEditarAtividade}
                    grupos={estagio.grupos}
                    numMaxDeAlunos={totalAlunosEstagio(estagio)}
                    aoEditarDataDeAtividade={aoEditarDataDeAtividade}
                  />
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
