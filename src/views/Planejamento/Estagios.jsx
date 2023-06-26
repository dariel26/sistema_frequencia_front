import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/User";
import { AiOutlineDelete } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";
import InputBotao from "../../componentes/inputs/InputBotao";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../componentes/divs/DivCabecalhoDeletar";
import { formatarDataAMD, gerarChaveUnica } from "../../utils";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import FormSelecao from "../../componentes/formularios/FormSelecao";
import FormData from "../../componentes/formularios/FormData";
import { idComponenteEscrol } from "../../components/cards/CardRadios";

export default function Estagios() {
  const [estagios, setEstagios] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [gruposADeletar, setGruposADeletar] = useState([]);
  const [datas, setDatas] = useState([]);

  const [estado, setEstado] = useState(0);

  const gruposAlocados = estagios.flatMap((e) => e.grupos);
  const textoBotaoSelecionar = deletando
    ? gruposADeletar.length > 0
      ? "Deletar"
      : "Cancelar"
    : "Selecionar";

  const alertaRef = useRef(useContext(AlertaContext));
  const usuario = useContext(UsuarioContext);

  const aoEscrolar = useCallback(() => {
    const componenteEscrol = document.getElementById(idComponenteEscrol);
    const componente = document.getElementById("editar-selecionar");
    const posicaoEscrol = componenteEscrol.scrollTop;
    if (posicaoEscrol > 0) {
      componente.classList.add("shadow-sm");
    } else {
      componente.classList.remove("shadow-sm");
    }
  }, []);

  useEffect(() => {
    const token = usuario.token;
    const p_estagios = apiSFE.listarEstagios(token);
    const p_coordenadores = apiSFE.listarCoordenadores(token);
    const p_grupos = apiSFE.listarGrupos(token);
    Promise.all([p_estagios, p_coordenadores, p_grupos])
      .then((res) => {
        const estagios = res[0].data;
        const coordenadores = res[1].data;
        const grupos = res[2].data;
        setEstagios(estagios);
        setCoordenadores(coordenadores);
        setGrupos(grupos);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
    const componenteEscrol = document.getElementById(idComponenteEscrol);
    componenteEscrol.addEventListener("scroll", aoEscrolar, false);
    return () => {
      componenteEscrol.removeEventListener("scroll", aoEscrolar, false);
    };
  }, [usuario, estado, aoEscrolar]);

  const aoAdicionarEstagio = (nome) => {
    apiSFE
      .adicionarEstagios(usuario.token, [{ nome }])
      .then(() => setEstado(estado + 1))
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  };

  const grupoADeletarSelecionado = (grupo) =>
    gruposADeletar.find((g) => g.id_estagiogrupo === grupo.id_estagiogrupo) !==
    undefined;

  const aoDeletarEstagio = ({ id_estagio }) => {
    const ids = [id_estagio];
    apiSFE
      .deletarEstagios(usuario.token, ids)
      .then(() => setEstado(estado + 1))
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoDeletarGrupo = () => {
    if (estagios.length === 0)
      return alertaRef.current.addAlert(new Error("Nenhum estágio existente"));
    if (gruposAlocados.length === 0)
      return alertaRef.current.addAlert(
        new Error("Nenhum grupo em estágio existente")
      );
    if (gruposADeletar.length > 0) {
      const ids = gruposADeletar.map(({ id_estagiogrupo }) => id_estagiogrupo);
      apiSFE
        .deletarGruposDeEstagios(usuario.token, ids)
        .then(() => {
          setDeletando(false);
          setGruposADeletar([]);
          setEstado(estado + 1);
        })
        .catch((err) => alertaRef.current.addAlert(err));
    } else {
      setDeletando(!deletando);
    }
  };

  const aoPreDeletarGrupo = (grupo) => {
    let novosGrupos = gruposADeletar;
    if (!grupoADeletarSelecionado(grupo)) {
      novosGrupos.push(grupo);
    } else {
      novosGrupos = novosGrupos.filter((g) => g.id_grupo !== grupo.id_grupo);
    }
    setGruposADeletar(Object.assign([], novosGrupos));
  };

  const aoAlocarAutomatico = () => {
    if (datas.length === 0)
      return alertaRef.current.addAlert(new Error("Nenhuma data adicionada"));
    if (estagios.length === 0)
      return alertaRef.current.addAlert(new Error("Nenhum estágio encontrado"));
    if (datas.length !== grupos.length)
      alertaRef.current.addAlert(
        new Error(
          "O número de intervalos de datas deve ser igual a " + grupos.length
        )
      );
    else {
      const dados = [];
      const gruposAgrupados = [];
      for (let k = 0; k < grupos.length; k++) {
        const iteracao = gruposAgrupados.length;
        const vetorGrupo = [];
        const vetorAuxiliar = [];
        for (let i = 0; i < grupos.length; i++) {
          const ultimo = grupos.length - 1;
          if (iteracao >= i + 1) {
            vetorAuxiliar.push(grupos[i].id_grupo);
          } else if (i === ultimo) {
            vetorGrupo.push(grupos[i].id_grupo);
            gruposAgrupados.push(vetorGrupo.concat(vetorAuxiliar));
          } else {
            vetorGrupo.push(grupos[i].id_grupo);
          }
        }
      }
      const gruposOrdenados = gruposAgrupados.flat();
      const gruposDatas = [];
      for (let i = 0; i < gruposOrdenados.length; i++) {
        const dado = {};
        dado.id_grupo = gruposOrdenados[i];
        dado.data_inicial = datas[i % datas.length].data_inicial;
        dado.data_final = datas[i % datas.length].data_final;
        gruposDatas.push(dado);
      }
      for (let i = 0; i < estagios.length; i++) {
        const id_estagio = estagios[i].id_estagio;
        for (let j = 0; j < estagios.length; j++) {
          if (gruposDatas[i * estagios.length + j] === undefined) break;
          const dado = gruposDatas[i * estagios.length + j];
          dado.id_estagio = id_estagio;
          dados.push(dado);
        }
      }

      apiSFE
        .adicionarGruposAEstagios(usuario.token, dados)
        .then(() => setEstado(estado + 1))
        .catch((err) => alertaRef.current.addAlert(err));
    }
  };

  const aoAdicionarCoordenador = ({ valor, opcao }) => {
    let dados = [
      {
        id_estagio: opcao.id_estagio,
        id_coordenador: valor.id_coordenador,
      },
    ];
    apiSFE
      .adicionarCoordenadoresAEstagios(usuario.token, dados)
      .then(() => {
        setEstado((reset) => reset + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  };

  const aoEditar = () => {
    if (estagios.length === 0 && !editando) {
      alertaRef.current.addAlert(new Error("Nenhum estágio para editar"));
    } else {
      setEditando(!editando);
    }
  };

  const aoPreAdicionarData = (data) => {
    if (datas.find((d) => d.data_inicial === data.data_inicial) === undefined) {
      datas.push(data);
      setDatas(Object.assign([], datas));
    } else {
      alertaRef.current.addAlert(
        new Error("Essa data inicial já existe em outro intervalo")
      );
    }
  };

  const aoDeletarData = (data) => {
    setDatas((datas) =>
      datas.filter((d) => formatarDataAMD(d.data_inicial) !== data.data_inicial)
    );
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <div
        id="editar-selecionar"
        className="col-12 position-sticky top-0 bg-white z-1"
      >
        <BotaoTexto
          aoClicar={aoEditar}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
          visivel
        />
        <BotaoTexto
          aoClicar={aoDeletarGrupo}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!editando}
        />
      </div>
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {estagios.map(
              ({ nome_coordenador, nome_estagio, grupos, id_estagio }) => {
                const estagioSemCoordenador = nome_coordenador === null;
                const colorSpan = estagioSemCoordenador ? "text-danger" : "";
                const textSpan = estagioSemCoordenador
                  ? "Nenhum"
                  : nome_coordenador;
                return (
                  <div className="mb-2" key={gerarChaveUnica()}>
                    <DivCabecalhoDeletar
                      textoBotao="Deletar Estagio"
                      titulo={nome_estagio}
                      aoDeletar={() => aoDeletarEstagio({ id_estagio })}
                    >
                      <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                        <div className="col-sm-8 p-0 mb-1">
                          <span>Coordenador: </span>
                          <span className={`fw-bold ${colorSpan}`}>
                            {textSpan}
                          </span>
                        </div>
                      </div>
                      <TabelaPadrao
                        numerado
                        aoClicar={(grupo) => aoPreDeletarGrupo(grupo)}
                        camposCabecalho={[
                          { texto: "Rodízio", visivel: true },
                          { texto: "Grupo", visivel: true },
                          { texto: "Data inicial", visivel: true },
                          { texto: "Data final", visivel: true },
                          { texto: "Deletar", visivel: deletando },
                        ]}
                        dados={grupos}
                        camposDados={[
                          { texto: "nome", visivel: true },
                          { data: "data_inicial", visivel: true },
                          { data: "data_final", visivel: true },
                          {
                            check: true,
                            visivel: deletando,
                            selecionado: (grupo) =>
                              grupoADeletarSelecionado(grupo),
                          },
                        ]}
                      />
                    </DivCabecalhoDeletar>
                  </div>
                );
              }
            )}
          </div>
          <div className="col-sm-12 col-xl-8 mt-5 mb-5">
            <InputBotao
              textoReferencia={"Nome do estágio"}
              maximaLargura={300}
              aoClicar={aoAdicionarEstagio}
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-sm-12 col-xl-8 mb-4">
            <TabelaPadrao
              numerado
              camposCabecalho={[
                { texto: "#", visivel: true },
                { texto: "Estagio", visivel: true },
                { texto: "Coordenador", visivel: true },
                { texto: "Datas alocadas", visivel: true },
              ]}
              dados={estagios.map(
                ({ nome_estagio, nome_coordenador, grupos }) => ({
                  nome_estagio,
                  nome_coordenador,
                  qntd_grupos: grupos.length,
                })
              )}
              camposDados={[
                { texto: "nome_estagio", visivel: true },
                { texto: "nome_coordenador", visivel: true },
                { texto: "qntd_grupos", visivel: true },
              ]}
            />
          </div>
          <div className="col-sm-12 col-xl-8 mb-4">
            <FormSelecao
              titulo="Coordenador"
              textoReferencia="Escolha o coordenador"
              campoSelecao="nome"
              opcoesSelecao={coordenadores}
              textoBotao="Adicionar ao estagio..."
              opcoesDrop={estagios}
              campoDrop="nome_estagio"
              aoEscolher={aoAdicionarCoordenador}
            />
          </div>
          <div className="col-sm-12 col-xl-8 mb-4">
            <FormData
              titulo="Escolha um intervalo"
              textoBotao="Adicionar"
              aoSelecionarDatas={aoPreAdicionarData}
            />
          </div>
          <div className="col-sm-12 col-xl-8">
            <button className="btn btn-secondary" onClick={aoAlocarAutomatico}>
              Alocação Automática
            </button>
          </div>
          <div className="col-sm-12 col-xl-8 ">
            <TabelaPadrao
              numerado
              camposCabecalho={[
                { texto: "#", visivel: true },
                { texto: "Data inicial", visivel: true },
                { texto: "Data final", visivel: true },
                { texto: "Deletar", visivel: true },
              ]}
              dados={datas.map(({ data_inicial, data_final }) => ({
                data_inicial: formatarDataAMD(data_inicial),
                data_final: formatarDataAMD(data_final),
              }))}
              camposDados={[
                { data: "data_inicial", visivel: true },
                { data: "data_final", visivel: true },
                {
                  funcaoComponente: (data) => (
                    <button className="btn" onClick={() => aoDeletarData(data)}>
                      <AiOutlineDelete size={18} />
                    </button>
                  ),
                  visivel: true,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
