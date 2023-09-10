import { useEffect, useState, useContext, useRef } from "react";
import { Col } from "react-bootstrap";
import { TabelaPadrao, BotaoTexto, BotaoDrop } from "../../../componentes";
import { UsuarioContext, SistemaContext } from "../../../contexts";
import apiSFE from "../../../service/api";
import { errors } from "../../../utils";

export default function GruposEdicao({ atualizarGrupos }) {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const { carregando, error } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);

  const nenhumAlunoSelecionado = alunosSelecionados.length === 0;
  const todosOsAlunosSelecionados = alunosSelecionados.length === alunos.length;
  const token = usuario.token;
  const botaoAlocarVisivel = alunosSelecionados.length > 0;
  const textoBotaoSelecionarTodos = todosOsAlunosSelecionados
    ? "Desfazer"
    : "Selecionar todos";

  useEffect(() => {
    carregando(true);
    const p_grupos = apiSFE.listarGrupos(token);
    const p_alunos = apiSFE.listarAlunos(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        const grupos = res[0].data;
        const alunos = res[1].data;
        setGrupos(grupos);
        setAlunos(alunos);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [token, error, carregando]);

  const editarAluno = async (novosDados) => {
    try {
      await apiSFE.adicionarAlunoAGrupo(token, novosDados);
      const res = await apiSFE.listarAlunos(token);
      await atualizarGrupos();
      setAlunos(res.data);
      return "Alunos associados!";
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarNoGrupo = (grupo) => {
    const novosDados = alunosSelecionados.map(({ id_usuario }) => ({
      id_usuario,
      id_grupo: grupo.id_grupo,
    }));

    return editarAluno(novosDados);
  };

  const aoAlocarAutomaticamente = () => {
    const novosDados = [];
    const qtdGrupos = grupos.length;
    let indexGrupo = 0;

    alunos.forEach(({ id_usuario }) => {
      const grupoAtual = grupos[indexGrupo];
      const novoDado = {
        id_usuario,
        id_grupo: grupoAtual.id_grupo,
      };
      novosDados.push(novoDado);
      indexGrupo = (indexGrupo + 1) % qtdGrupos;
    });

    return editarAluno(novosDados);
  };

  const aoSelecionarTodos = () => {
    let novosAlunos = [];
    if (!todosOsAlunosSelecionados) novosAlunos.push(...alunos);
    setAlunosSelecionados(novosAlunos);
  };

  const alunoJaSelecionado = (aluno) => {
    return alunosSelecionados.some((a) => a.id_usuario === aluno.id_usuario);
  };

  const aoSelecionarAlunos = (aluno) => {
    let novosAlunos = alunosSelecionados;
    if (!alunoJaSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosSelecionados.filter(
        (a) => a.id_usuario !== aluno.id_usuario
      );
    }
    setAlunosSelecionados(Object.assign([], novosAlunos));
  };

  return (
    <>
      <Col sm="12" xl="8" className="mb-3">
        <BotaoDrop
          textoBotao={nenhumAlunoSelecionado ? "Associar..." : "Associar ao..."}
          dadosMenu={grupos
            .map((g) => ({
              texto: g.nome_grupo,
              visible: botaoAlocarVisivel,
              acao: () => aoAlocarNoGrupo(g),
            }))
            .concat(
              nenhumAlunoSelecionado && [
                {
                  texto: "Automaticamente",
                  visible: true,
                  acao: aoAlocarAutomaticamente,
                },
              ]
            )}
        />
      </Col>
      <Col sm="12" xl="8" className="mb-1">
        <BotaoTexto
          aoClicar={aoSelecionarTodos}
          texto={textoBotaoSelecionarTodos}
          visivel
        />
        <BotaoTexto
          className="ms-3"
          aoClicar={() => setAlunosSelecionados([])}
          texto={"Limpar"}
          visivel
        />
      </Col>
      <Col sm="12" xl="8">
        <TabelaPadrao
          aoClicar={aoSelecionarAlunos}
          dados={alunos.map((a) => ({
            ...a,
            nome_grupo: a.nome_grupo ?? "-",
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
              selecionado: (aluno) => alunoJaSelecionado(aluno),
            },
          ]}
        />
      </Col>
    </>
  );
}
