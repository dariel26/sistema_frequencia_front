import { useContext, useRef, useEffect, useState } from "react";
import apiSFE from "../../../service/api";
import uuid from "react-uuid";
import { CardAtividade, InputBotao } from "../../../componentes";
import { UsuarioContext, SistemaContext } from "../../../contexts";
import { amdEmData, errors } from "../../../utils";

export default function Atividades() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [preceptores, setPreceptores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [coordenadores, setCoordeandores] = useState([]);

  const { carregando, error } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
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
    carregando(true);
    const p_alunos = apiSFE.listarAlunos(token);
    const p_preceptores = apiSFE.listarPreceptores(token);
    const p_coordenadores = apiSFE.listarCoordenadores(token);
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
      p_coordenadores,
    ])
      .then((res) => {
        const alunos = res[0].data;
        const estagios = res[2].data.map((e) => ({
          ...e,
          grupos: e.grupos.map((g) => ({
            ...g,
            data_inicial: amdEmData(g.data_inicial),
            data_final: amdEmData(g.data_final),
          })),
        }));
        const atividades = res[4].data;
        setLocais(res[5].data);
        setPreceptores(res[1].data);
        setAlunos(alunos);
        setEstagios(estagios);
        setAtividades(atividades);
        setCoordeandores(res[6].data);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [token, error, carregando]);

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
      const atividadesAtualizadas = (await apiSFE.listarAtividades(token)).data;
      setAtividades(atividadesAtualizadas);
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

  const aoAlocarPreceptor = async ({ id_usuario, id_atividade }) => {
    try {
      await apiSFE.adicionarPreceptoresAAtividades(token, [
        { id_usuario, id_atividade },
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
      return await apiSFE.editarAtividades(token, dado);
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
      {gruposDeEstagios?.map((estagio) => (
        <div
          className="row w-100 m-0 p-0 justify-content-center mb-4"
          key={uuid()}
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
                  key={uuid()}
                  atividade={atividades.find(
                    (a) => a.id_atividade === atividade.id_atividade
                  )}
                  dataInicial={dataInicialSemestre}
                  dataFinal={dataFinalSemestre}
                  preceptores={preceptores}
                  coordenadores={coordenadores}
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
      ))}
    </div>
  );
}
