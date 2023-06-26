import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/User";
import InputBotao from "../../componentes/inputs/InputBotao";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../componentes/divs/DivCabecalhoDeletar";
import { gerarChaveUnica } from "../../utils";
import BotaoDrop from "../../componentes/botoes/BotaoDrop";
import { idComponenteEscrol } from "../../components/cards/CardRadios";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [alunosAAlocar, setAlunosAAlocar] = useState([]);
  const [alunosADesalocar, setAlunosADesalocar] = useState([]);
  const [estado, setEstado] = useState(0);
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const textoBotaoEditar = editando ? "Voltar" : "Editar";
  const textoBotaoDeletar = deletando
    ? alunosADesalocar.length > 0
      ? "Desassociar"
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
    const p_grupos = apiSFE.listarGrupos(token);
    const p_alunos = apiSFE.listarAlunos(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        const grupos = res[0].data;
        const alunos = res[1].data;
        setGrupos(grupos);
        setAlunos(alunos);
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

  const aoCriarGrupo = (nome) => {
    if (nome === "")
      return alertaRef.current.addAlert(
        new Error("Deve ser dado um nome ao grupo")
      );
    apiSFE
      .adicionarGrupos(usuario.token, [{ nome }])
      .then(() => {
        setEstado((e) => e + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoAlocarNoGrupo = (grupo) => {
    const novosDados = alunosAAlocar.map(({ id_aluno }) => ({
      id_aluno,
      id_grupo: grupo.id_grupo,
    }));
    apiSFE
      .editarAlunos(usuario.token, novosDados)
      .then(() => {
        setAlunosAAlocar([]);
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const retornaNomeGrupo = ({ id_grupo }) => {
    if (id_grupo === null) return "-";
    return grupos.find((g) => g.id_grupo === id_grupo)?.nome_grupo;
  };

  const aoAlocarAutomaticamente = () => {
    const novosDados = [];
    const qtdGrupos = grupos.length;
    let indexGrupo = 0;

    alunos.forEach(({ id_aluno }) => {
      const grupoAtual = grupos[indexGrupo];
      const novoDado = {
        id_aluno,
        id_grupo: grupoAtual.id_grupo,
      };
      novosDados.push(novoDado);
      indexGrupo = (indexGrupo + 1) % qtdGrupos;
    });

    apiSFE
      .editarAlunos(usuario.token, novosDados)
      .then(() => {
        setAlunosAAlocar([]);
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const alunoAAlocarSelecionado = (aluno) =>
    alunosAAlocar.find((a) => a.id_aluno === aluno.id_aluno) !== undefined;

  const aoSelecionarAlunosParaAlocar = (aluno) => {
    let novosAlunos = alunosAAlocar;
    if (!alunoAAlocarSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosAAlocar.filter((a) => a.id_aluno !== aluno.id_aluno);
    }
    setAlunosAAlocar(Object.assign([], novosAlunos));
  };

  const alunoADeletarSelecionado = (aluno) =>
    alunosADesalocar.find((a) => a.id_aluno === aluno.id_aluno) !== undefined;

  const aoSelecionarAlunoParaDeletar = (aluno) => {
    let novosAlunos = alunosADesalocar;
    if (!alunoADeletarSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosADesalocar.filter(
        (a) => a.id_aluno !== aluno.id_aluno
      );
    }
    setAlunosADesalocar(Object.assign([], novosAlunos));
  };

  const aoSelecionarTodos = () => {
    let novosAlunos = [];
    if (alunosAAlocar.length !== alunos.length) {
      novosAlunos.push(...alunos);
    }
    setAlunosAAlocar(novosAlunos);
  };

  const aoClicarEditar = () => {
    setEditando(!editando);
  };

  const aoDeletarGrupo = ({ id_grupo }) => {
    apiSFE
      .deletarGrupos(usuario.token, [id_grupo])
      .then(() => {
        setEstado((e) => e + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoCliclarDeletarAluno = () => {
    if (alunosADesalocar.length > 0) {
      const novosDados = alunosADesalocar.map(({ id_aluno }) => ({
        id_aluno,
        id_grupo: null,
      }));
      apiSFE
        .editarAlunos(usuario.token, novosDados)
        .then(() => {
          setDeletando(false);
          setAlunosADesalocar([]);
          setEstado(estado + 1);
        })
        .catch((err) => alertaRef.current.addAlert(err));
    } else {
      setDeletando(!deletando);
    }
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <div
        id="editar-selecionar"
        className="col-12 position-sticky top-0 bg-white z-1"
      >
        <BotaoTexto
          aoClicar={aoClicarEditar}
          className="mb-2 me-3"
          texto={textoBotaoEditar}
          visivel
        />
        <BotaoTexto
          aoClicar={aoCliclarDeletarAluno}
          className="mb-2"
          texto={textoBotaoDeletar}
          visivel={!editando}
        />
      </div>
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {grupos.map((grupo) => (
              <div className="mb-2" key={gerarChaveUnica()}>
                <DivCabecalhoDeletar
                  titulo={grupo.nome_grupo}
                  textoBotao="Deletar Grupo"
                  aoDeletar={() => aoDeletarGrupo(grupo)}
                >
                  <TabelaPadrao
                    aoClicar={(aluno) => aoSelecionarAlunoParaDeletar(aluno)}
                    numerado
                    camposCabecalho={[
                      { texto: "#", visivel: true },
                      { texto: "Nome", visivel: true },
                      { texto: "Matricula", visivel: true },
                      { texto: "Desassociar", visivel: deletando },
                    ]}
                    dados={grupo?.alunos}
                    campoDadosUnico="id_aluno"
                    camposDados={[
                      { texto: "nome", visivel: true },
                      { texto: "matricula", visivel: true },
                      {
                        check: true,
                        selecionado: (aluno) => alunoADeletarSelecionado(aluno),
                        visivel: deletando,
                      },
                    ]}
                  />
                </DivCabecalhoDeletar>
              </div>
            ))}
          </div>
          <div className="col-sm-12 col-xl-8 mb-5 mt-5">
            <InputBotao
              textoReferencia={"Nome do grupo"}
              maximaLargura={300}
              aoClicar={aoCriarGrupo}
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-sm-12 col-xl-8 mb-3">
            <BotaoDrop
              textoBotao="Alocar..."
              dadosMenu={grupos
                .map((g) => ({
                  texto: g.nome_grupo,
                  visible: alunosAAlocar.length > 0,
                  acao: () => aoAlocarNoGrupo(g),
                }))
                .concat([
                  {
                    texto: "Automaticamente",
                    visible: true,
                    acao: aoAlocarAutomaticamente,
                  },
                ])}
            />
          </div>
          <div className="col-sm-12 col-xl-8 mb-1">
            <BotaoTexto
              aoClicar={aoSelecionarTodos}
              texto={
                alunosAAlocar.length === alunos.length
                  ? "Desfazer"
                  : "Selecionar todos"
              }
            />
          </div>
          <div className="col-sm-12 col-xl-8">
            <TabelaPadrao
              aoClicar={(aluno) => aoSelecionarAlunosParaAlocar(aluno)}
              dados={alunos.map((a) => ({
                ...a,
                nome_grupo: retornaNomeGrupo(a),
              }))}
              camposCabecalho={[
                { texto: "Nome aluno", visivel: true },
                { texto: "Grupo alocado", visivel: true },
                { texto: "Selecionar", visivel: true },
              ]}
              camposDados={[
                { texto: "nome", visivel: true },
                { texto: "nome_grupo", visivel: true },
                {
                  check: true,
                  visivel: true,
                  selecionado: (dado) => alunoAAlocarSelecionado(dado),
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
