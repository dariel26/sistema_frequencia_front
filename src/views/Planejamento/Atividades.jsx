import { useContext, useEffect, useRef, useState } from "react";
import { UsuarioContext } from "../../filters/User";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import InputBotao from "../../components/inputs/InputBotao";
import { Typeahead } from "react-bootstrap-typeahead";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import { gerarChaveUnica } from "../../utils";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import CheckPadrao from "../../componentes/inputs/CheckPadrao";
import FormSelecao from "../../componentes/formularios/FormSelecao";

export default function Atividades() {
  const [estagios, setEstagios] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [atividadesADeletar, setAtividadesADeletar] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({});
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
  }, [usuario, estado]);

  const atividadeADeletarSelecionada = (atividade) =>
    atividadesADeletar.find(
      (a) => a.id_atividade === atividade.id_atividade
    ) !== undefined;

  const atividadeAlocadaNoEstagio = (estagio) => {
    if (atividadeSelecionada?.id_estagio === estagio.id_estagio) return true;
    else return false;
  };

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

  const aoAdicionarAtividade = ({ valor, opcao }) => {
    const atividade = {
      ...valor,
      id_estagio: atividadeAlocadaNoEstagio(opcao) ? null : opcao.id_estagio,
    };

    const novosDados = [
      {
        id_atividade: atividade.id_atividade,
        id_estagio: atividade.id_estagio,
      },
    ];
    apiSFE
      .editarAtividades(usuario.token, novosDados)
      .then(() => {
        setAtividadeSelecionada(Object.assign({}, atividade));
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoEditar = () => {
    if (atividades.length < 1)
      return alertaRef.current.addAlert(
        new Error("Nenhuma atividade para editar")
      );
    setEditando(!editando);
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
            className="mb-2"
            aoClicar={aoDeletarAtividades}
            texto={textoSelecao}
          />
        </div>
      </div>
      {(editando ? atividadesAgrupadas : atividadesAgrupadasFiltradas).map(
        (grupo) => (
          <div
            className="mb-5 border-bottom border-4 border-primary"
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
        )
      )}
      {editando ? (
        <div className="ms-1">
          <FormSelecao
            titulo="Atividade"
            textoReferencia="Escolha a atividade"
            campoSelecao="nome"
            opcoesSelecao={atividades}
            textoBotao="Adicionar ao estágio..."
            opcoesDrop={estagios.map((e) => {
              return atividadeAlocadaNoEstagio(e)
                ? {
                    nome_estagio: "Retirar do estagio",
                    id_estagio: e.id_estagio,
                  }
                : e;
            })}
            aoEscolher={aoAdicionarAtividade}
            campoDrop="nome_estagio"
            aoSelecionar={(atividade) => setAtividadeSelecionada(atividade)}
          />
        </div>
      ) : (
        <InputBotao
          textoReferencia={"Nome da atividade"}
          maximaLargura={300}
          aoClicar={aoCriarAtividade}
        />
      )}
    </div>
  );
}
