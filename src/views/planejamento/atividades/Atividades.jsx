import { useContext, useRef, useEffect, useState } from "react";
import apiSFE from "../../../service/api";
import { CardAtividade, InputBotao } from "../../../componentes";
import { UsuarioContext, SistemaContext } from "../../../contexts";
import { amdEmData, errors } from "../../../utils";
import uuid from "react-uuid";

export default function Atividades() {
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [preceptores, setPreceptores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [coordenadores, setCoordeandores] = useState([]);

  const { carregando, error, confirma } = useRef(
    useContext(SistemaContext)
  ).current;

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
  }, [token, carregando, error]);

  const aoAlocarAtividade = async (id_estagio, nome) => {
    try {
      const novasAtividades = (
        await apiSFE.adicionarAtividades(token, [{ id_estagio, nome }])
      ).data;
      const estagiosAtualizados = (await apiSFE.listarEstagios(token)).data;
      setAtividades(novasAtividades);
      setEstagios(
        estagiosAtualizados.map((e) => ({
          ...e,
          grupos: e.grupos.map((g) => ({
            ...g,
            data_inicial: amdEmData(g.data_inicial),
            data_final: amdEmData(g.data_final),
          })),
        }))
      );
    } catch (err) {
      throw err;
    }
  };

  const aoDeletarAtividade = async ({ id_atividade }) => {
    const resposta = await confirma(
      `Ao excluir esta atividade, todas as datas
       associadas a ela e os respectivos alunos 
       designados para essas datas serão removidos permanentemente.`
    );
    if (!resposta) return;
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
          key={estagio.id_estagio >> uuid()}
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
            <div
              className="col-sm-12 col-xl-8 mb-2"
              key={atividade.id_atividade}
            >
              <div className="ms-1">
                <CardAtividade
                  atividade={atividade}
                  preceptores={preceptores}
                  coordenadores={coordenadores}
                  locais={locais}
                  aoDeletarAtividade={aoDeletarAtividade}
                  grupos={estagio.grupos}
                  numMaxDeAlunos={totalAlunosEstagio(estagio)}
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
