import { useEffect, useState, useContext, useRef } from "react";
import { Col } from "react-bootstrap";
import BotaoDrop from "../../../componentes/botoes/BotaoDrop";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import { UsuarioContext } from "../../../filters/Usuario";
import apiSFE from "../../../service/api";

export default function GruposEdicao({ atualizarGrupos }) {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;

  const nenhumAlunoSelecionado = alunosSelecionados.length === 0;
  const todosOsAlunosSelecionados = alunosSelecionados.length === alunos.length;
  const token = usuario.token;
  const botaoAlocarVisivel = alunosSelecionados.length > 0;
  const textoBotaoSelecionarTodos = todosOsAlunosSelecionados
    ? "Desfazer"
    : "Selecionar todos";

  useEffect(() => {
    apiSFE
      .listarGrupos(token)
      .then((res) => setGrupos(res.data))
      .catch((err) => alerta.adicionaAlerta(err));
  }, [token, alerta]);

  useEffect(() => {
    apiSFE
      .listarAlunos(token)
      .then((res) => setAlunos(res.data))
      .catch((err) => alerta.adicionaAlerta(err));
  }, [alerta, token]);

  const editarAluno = async (novosDados) => {
    try {
      const res = await apiSFE.editarAlunos(token, novosDados);
      await atualizarGrupos();
      setAlunos(res.data);
      return "Alunos associados!";
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarNoGrupo = (grupo) => {
    const novosDados = alunosSelecionados.map(({ id_aluno }) => ({
      id_aluno,
      id_grupo: grupo.id_grupo,
    }));

    return editarAluno(novosDados);
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

    return editarAluno(novosDados);
  };

  const aoSelecionarTodos = () => {
    let novosAlunos = [];
    if (!todosOsAlunosSelecionados) novosAlunos.push(...alunos);
    setAlunosSelecionados(novosAlunos);
  };

  const alunoJaSelecionado = (aluno) => {
    return alunosSelecionados.some((a) => a.id_aluno === aluno.id_aluno);
  };

  const aoSelecionarAlunos = (aluno) => {
    let novosAlunos = alunosSelecionados;
    if (!alunoJaSelecionado(aluno)) {
      novosAlunos.push(aluno);
    } else {
      novosAlunos = alunosSelecionados.filter(
        (a) => a.id_aluno !== aluno.id_aluno
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
