import { useState, useContext, useEffect, useRef } from "react";
import { AlertaContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/User";
import InputBotao from "../../components/inputs/InputBotao";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import CheckPadrao from "../../componentes/inputs/CheckPadrao";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../componentes/divs/DivCabecalhoDeletar";
import { gerarChaveUnica } from "../../utils";
import BotaoDrop from "../../componentes/botoes/BotaoDrop";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [alunosEscohidos, setAlunosEscolhidos] = useState([]);
  const [alunosADeletar, setAlunosADeletar] = useState([]);
  const [estado, setEstado] = useState(0);
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const alunosSemGrupo = alunos.filter((a) => a.id_grupo === null);
  const sessaoEditarVisible = editando && alunosSemGrupo.length > 0;
  const textoBotaoEditar = sessaoEditarVisible ? "Cancelar" : "Editar";
  const textoBotaoDeletar = deletando
    ? alunosADeletar.length > 0
      ? "Deletar"
      : "Cancelar"
    : "Selecionar";

  const alertaRef = useRef(useContext(AlertaContext));
  const usuario = useContext(UsuarioContext);

  useEffect(() => {
    const token = usuario.token;
    const p_grupos = apiSFE.listarGrupos(token);
    const p_alunos = apiSFE.listarAlunos(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        const grupos = res[0].data;
        const alunos = res[1].data;
        const alunosSemGrupo = alunos.filter((a) => a.id_grupo === null);
        if (alunosSemGrupo.length < 1) setEditando(false);
        setGrupos(grupos);
        setAlunos(alunos);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }, [usuario, estado]);

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

  const aoDeletarGrupo = ({ id_grupo }) => {
    apiSFE
      .deletarGrupos(usuario.token, [id_grupo])
      .then(() => {
        setEstado((e) => e + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoAlocarEmGrupo = (grupo) => {
    const novosDados = alunosEscohidos.map(({ id_aluno }) => ({
      id_aluno,
      id_grupo: grupo.id_grupo,
    }));
    apiSFE
      .editarAlunos(usuario.token, novosDados)
      .then(() => {
        setAlunosEscolhidos([]);
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
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
        setAlunosEscolhidos([]);
        setEditando(false);
        setEstado(estado + 1);
      })
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const alunoAAdicionarSelecionado = (aluno) =>
    alunosEscohidos.find((a) => a.id_aluno === aluno.id_aluno) !== undefined;

  const aoPreAdicionarAluno = (aluno) => {
    let novosAlunos = alunosEscohidos;
    if (!alunoAAdicionarSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosEscohidos.filter(
        (a) => a.id_aluno !== aluno.id_aluno
      );
    }
    setAlunosEscolhidos(Object.assign([], novosAlunos));
  };

  const alunoADeletarSelecionado = (aluno) =>
    alunosADeletar.find((a) => a.id_aluno === aluno.id_aluno) !== undefined;

  const aoDeletarAlunos = () => {
    if (alunosADeletar.length > 0) {
      const novosDados = alunosADeletar.map(({ id_aluno }) => ({
        id_aluno,
        id_grupo: null,
      }));
      apiSFE
        .editarAlunos(usuario.token, novosDados)
        .then(() => {
          setDeletando(false);
          setAlunosADeletar([]);
          setEstado(estado + 1);
        })
        .catch((err) => alertaRef.current.addAlert(err));
    } else {
      setDeletando(!deletando);
    }
  };

  const aoPreDeletarAluno = (aluno) => {
    let novosAlunos = alunosADeletar;
    if (!alunoADeletarSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosADeletar.filter((a) => a.id_aluno !== aluno.id_aluno);
    }
    setAlunosADeletar(Object.assign([], novosAlunos));
  };

  const aoSelecionarTodos = () => {
    let novosAlunos = [];
    if (alunosEscohidos.length !== alunosSemGrupo.length) {
      novosAlunos.push(...alunosSemGrupo);
    }
    setAlunosEscolhidos(novosAlunos);
  };

  const aoEditar = () => {
    if (alunosSemGrupo.length > 0) setEditando(!editando);
    else alertaRef.current.addAlert(new Error("Todos os alunos alocados"));
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      <div className="row w-100">
        <div className="col">
          <BotaoTexto
            aoClicar={aoEditar}
            className="mb-2 me-3"
            texto={textoBotaoEditar}
          />
          <BotaoTexto
            aoClicar={aoDeletarAlunos}
            className="mb-2"
            texto={textoBotaoDeletar}
          />
        </div>
      </div>

      {grupos.map((grupo) => (
        <DivCabecalhoDeletar
          key={gerarChaveUnica()}
          titulo={grupo.nome_grupo}
          textoBotao="Deletar Grupo"
          aoDeletar={() => aoDeletarGrupo(grupo)}
        >
          <TabelaPadrao
            aoClicar={(aluno) => aoPreDeletarAluno(aluno)}
            numerado
            camposCabecalho={[
              { texto: "#", visivel: true },
              { texto: "Nome", visivel: true },
              { texto: "Matricula", visivel: true },
              { texto: "Deletar", visivel: deletando },
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
      ))}

      {sessaoEditarVisible ? (
        <div className="row w-100 m-0 ms-1">
          <div className="col-12 mb-3 p-0">
            <BotaoDrop
              textoBotao="Preencher..."
              dadosMenu={grupos
                .map((g) => ({
                  texto: g.nome_grupo,
                  visible: alunosEscohidos.length > 0,
                  acao: () => aoAlocarEmGrupo(g),
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
          <div className="col-12 p-0 mb-1">
            <BotaoTexto
              aoClicar={aoSelecionarTodos}
              texto={
                alunosSemGrupo.length === alunosEscohidos.length
                  ? "Desfazer"
                  : "Selecionar todos"
              }
            />
          </div>
          <div className="col-5 p-0">
            <TabelaPadrao
              aoClicar={(aluno) => aoPreAdicionarAluno(aluno)}
              dados={alunosSemGrupo}
              camposCabecalho={[
                { texto: "Nome", visivel: true },
                { texto: "Selecionar", visivel: true },
              ]}
              camposDados={[
                { texto: "nome", visivel: true },
                {
                  check: true,
                  visivel: true,
                  selecionado: (dado) => alunoAAdicionarSelecionado(dado),
                },
              ]}
            />
          </div>
        </div>
      ) : (
        <InputBotao
          textoReferencia={"Nome do grupo"}
          maximaLargura={300}
          aoClicar={aoCriarGrupo}
        />
      )}
    </div>
  );
}
