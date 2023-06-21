import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UsuarioContext } from "../../filters/User";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import InputBotao from "../../components/inputs/InputBotao";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import { gerarChaveUnica } from "../../utils";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import BotaoDrop from "../../componentes/botoes/BotaoDrop";
import { idComponenteEscrol } from "../../components/cards/CardRadios";

export default function Atividades() {
  const [estagios, setEstagios] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [atividadesADeletar, setAtividadesADeletar] = useState([]);
  const [atividadesEscolhidas, setAtividadesEscolhidas] = useState([]);
  const [estado, setEstado] = useState(0);

  const atividadesSemEstagio = atividades.filter((a) => a.id_estagio === null);
  const atividadesAgrupadas = [
    {
      id_estagio: 0,
      nome_estagio: "Atividades Gerais",
      atividades: atividadesSemEstagio,
    },
    ...estagios,
  ];
  const atividadesAgrupadasFiltradas = atividadesAgrupadas.filter(
    (a) => a.atividades.length > 0
  );
  const textoSelecao = deletando
    ? atividadesADeletar.length > 0
      ? "Deletar"
      : "Cancelar"
    : "Selecionar";

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

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
    const p_atividades = apiSFE.listarAtividades(token);
    Promise.all([p_estagios, p_atividades])
      .then((res) => {
        const estagios = res[0].data;
        const atividades = res[1].data;
        setEstagios(estagios);
        setAtividades(atividades);
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

  const atividadeADeletarSelecionada = (atividade) =>
    atividadesADeletar.find(
      (a) => a.id_atividade === atividade.id_atividade
    ) !== undefined;

  const aoPreDeletarAtividade = (atividade) => {
    let atividades = atividadesADeletar;
    if (!atividadeADeletarSelecionada(atividade)) {
      atividades.push(atividade);
    } else {
      atividades = atividadesADeletar.filter(
        (a) => a.id_atividade !== atividade.id_atividade
      );
    }
    setAtividadesADeletar(Object.assign([], atividades));
  };

  const aoDeletarAtividades = () => {
    if (atividades.length < 1)
      return alertaRef.current.addAlert(new Error("Não existem atividades"));
    if (atividadesADeletar.length > 0) {
      const ids = atividadesADeletar.map(({ id_atividade }) => id_atividade);
      apiSFE
        .deletarAtividades(usuario.token, ids)
        .then(() => {
          setDeletando(false);
          setAtividadesADeletar([]);
          setEstado(estado + 1);
        })
        .catch((err) => alertaRef.current.addAlert(err));
    } else {
      setDeletando(!deletando);
    }
  };

  const aoCriarAtividade = (nome) => {
    apiSFE
      .adicionarAtividades(usuario.token, [{ nome, id_estagio: null }])
      .then(() => setEstado(estado + 1))
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoPreAdicionarAtividade = (atividade) => {
    let novasAtividades = atividadesEscolhidas;
    if (!atividadeAAdicionarSelecionada(atividade)) {
      novasAtividades.push(atividade);
    } else {
      novasAtividades = atividadesEscolhidas.filter(
        (a) => a.id_atividade !== atividade.id_atividade
      );
    }
    setAtividadesEscolhidas(Object.assign([], novasAtividades));
  };

  const atividadeAAdicionarSelecionada = (atividade) =>
    atividadesEscolhidas.find(
      (a) => a.id_atividade === atividade.id_atividade
    ) !== undefined;

  const aoAdicionarAtividade = ({ id_estagio }) => {
    const novosDados = atividadesEscolhidas.map(({ id_atividade }) => ({
      id_atividade,
      id_estagio,
    }));

    apiSFE
      .editarAtividades(usuario.token, novosDados)
      .then(() => {
        setAtividadesEscolhidas([]);
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const retornaNomeEstagio = (atividade) => {
    if (atividade.id_estagio === null) return "-";
    return estagios.find((e) => e.id_estagio === atividade.id_estagio)
      ?.nome_estagio;
  };
  const aoEditar = () => {
    if (atividades.length < 1)
      return alertaRef.current.addAlert(
        new Error("Nenhuma atividade para editar")
      );
    setEditando(!editando);
  };

  return (
    <div className="row w-100 justify-content-center">
      <div
        id="editar-selecionar"
        className="col-12 position-sticky top-0 bg-white z-1"
      >
        <BotaoTexto
          aoClicar={aoEditar}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
        />
        <BotaoTexto
          className="mb-2"
          aoClicar={aoDeletarAtividades}
          texto={textoSelecao}
        />
      </div>
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {(editando
              ? atividadesAgrupadas
              : atividadesAgrupadasFiltradas
            ).map((grupo) => (
              <div
                className="mb-2 border-bottom border-4 border-primary"
                key={gerarChaveUnica()}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fs-5 fw-bold">{grupo.nome_estagio}</span>
                </div>
                <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                  <TabelaPadrao
                    numerado
                    aoClicar={(atividade) => aoPreDeletarAtividade(atividade)}
                    camposCabecalho={[
                      { texto: "#", visivel: true },
                      { texto: "Nome", visivel: true },
                      { texto: "Deletando", visivel: deletando },
                    ]}
                    dados={grupo?.atividades}
                    camposDados={[
                      { texto: "nome", visivel: true },
                      {
                        check: true,
                        visivel: deletando,
                        selecionado: (atividade) =>
                          atividadeADeletarSelecionada(atividade),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="col-sm-12 col-xl-8 mt-5 mb-5">
            <InputBotao
              textoReferencia={"Nome da atividade"}
              maximaLargura={300}
              aoClicar={aoCriarAtividade}
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-sm-12 col-xl-8 mb-4">
            <BotaoDrop
              desabilitado={atividadesEscolhidas.length < 1}
              textoBotao="Alocar..."
              dadosMenu={estagios
                .map((e) => ({
                  texto: e.nome_estagio,
                  visible: true,
                  acao: () => aoAdicionarAtividade(e),
                }))
                .concat([
                  {
                    texto: "Retirar",
                    visible: true,
                    acao: () => aoAdicionarAtividade({ id_estagio: null }),
                  },
                ])}
            />
          </div>
          <div className="col-sm-12 col-xl-8">
            <TabelaPadrao
              aoClicar={(atividade) => aoPreAdicionarAtividade(atividade)}
              dados={atividades.map((a) => ({
                ...a,
                nome_estagio: retornaNomeEstagio(a),
              }))}
              camposCabecalho={[
                { texto: "Nome atividade", visivel: true },
                { texto: "Nome estagio", visivel: true },
                { texto: "Selecionar", visivel: true },
              ]}
              camposDados={[
                { texto: "nome", visivel: true },
                { texto: "nome_estagio", visivel: true },
                {
                  check: true,
                  visivel: true,
                  selecionado: (dado) => atividadeAAdicionarSelecionada(dado),
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
