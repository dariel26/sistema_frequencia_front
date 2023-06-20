import { useState, useContext, useEffect, useRef } from "react";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/User";
import { AiOutlineDelete } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";
import InputBotao from "../../components/inputs/InputBotao";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../componentes/divs/DivCabecalhoDeletar";
import { formatarData, gerarChaveUnica } from "../../utils";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import CheckPadrao from "../../componentes/inputs/CheckPadrao";
import FormSelecao from "../../componentes/formularios/FormSelecao";
import FormData from "../../componentes/formularios/FormData";

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
  }, [usuario, estado]);

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
      for (const estagio of estagios) {
        const gruposDisponiveis = [...grupos];

        for (const data of datas) {
          if (gruposDisponiveis.length === 0) {
            break;
          }

          const grupoIndex = Math.floor(
            Math.random() * gruposDisponiveis.length
          );
          const grupo = gruposDisponiveis.splice(grupoIndex, 1)[0];
          const combExistente = dados.find(
            (comb) =>
              comb.id_grupo === grupo.id_grupo &&
              comb.data_inicial === data.data_inicial
          );

          if (!combExistente) {
            dados.push({
              id_grupo: grupo.id_grupo,
              id_estagio: estagio.id_estagio,
              data_inicial: data.data_inicial,
              data_final: data.data_final,
            });
          }
        }
      }
      console.log(estagios.length);
      console.log(grupos.length);
      console.log(datas.length);
      console.log(dados.length);
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
      datas.filter((d) => formatarData(d.data_inicial) !== data.data_inicial)
    );
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      <div className="row w-100">
        <div className="col">
          <BotaoTexto
            aoClicar={aoEditar}
            className="mb-2 me-3"
            texto={editando ? "Cancelar" : "Editar"}
          />
          <BotaoTexto
            aoClicar={aoDeletarGrupo}
            className="mb-2"
            texto={textoBotaoSelecionar}
          />
        </div>
      </div>
      {estagios.map(
        ({ nome_coordenador, nome_estagio, grupos, id_estagio }) => {
          const estagioSemCoordenador = nome_coordenador === null;
          const colorSpan = estagioSemCoordenador ? "text-danger" : "";
          const textSpan = estagioSemCoordenador ? "Nenhum" : nome_coordenador;
          return (
            <DivCabecalhoDeletar
              key={gerarChaveUnica()}
              textoBotao="Deletar Estagio"
              titulo={nome_estagio}
              aoDeletar={() => aoDeletarEstagio({ id_estagio })}
            >
              <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                <div className="col-sm-8 p-0 mb-1">
                  <span>Coordenador: </span>
                  <span className={`fw-bold ${colorSpan}`}>{textSpan}</span>
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
                    selecionado: (grupo) => grupoADeletarSelecionado(grupo),
                  },
                ]}
              />
            </DivCabecalhoDeletar>
          );
        }
      )}

      {editando ? (
        <div className="ms-1">
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
          <FormData
            titulo="Escolha um intervalo"
            textoBotao="Adicionar"
            aoSelecionarDatas={aoPreAdicionarData}
          />
          <div className="row w-100 mt-2 ps-1">
            <div className="col p-0">
              <button
                className="btn btn-secondary"
                onClick={aoAlocarAutomatico}
              >
                Alocação Automática
              </button>
            </div>
          </div>
          <div className="row w-100 mt-2">
            <div className="col-sm-6 p-0">
              <TabelaPadrao
                numerado
                camposCabecalho={[
                  { texto: "#", visivel: true },
                  { texto: "Data inicial", visivel: true },
                  { texto: "Data final", visivel: true },
                  { texto: "Deletar", visivel: true },
                ]}
                dados={datas.map(({ data_inicial, data_final }) => ({
                  data_inicial: formatarData(data_inicial),
                  data_final: formatarData(data_final),
                }))}
                camposDados={[
                  { data: "data_inicial", visivel: true },
                  { data: "data_final", visivel: true },
                  {
                    funcaoComponente: (data) => (
                      <button
                        className="btn"
                        onClick={() => aoDeletarData(data)}
                      >
                        <AiOutlineDelete size={18} />
                      </button>
                    ),
                    visivel: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      ) : (
        <InputBotao
          textoReferencia={"Nome do estágio"}
          maximaLargura={300}
          aoClicar={aoAdicionarEstagio}
        />
      )}
    </div>
  );
}
