import { useState, useRef, useContext, useEffect } from "react";
import apiSFE from "../../../service/api";
import { Col, Row } from "react-bootstrap";
import {
  BotaoTexto,
  TabelaPadrao,
  CardLinksBarraFixa,
} from "../../../componentes";
import { FaUserEdit } from "react-icons/fa";
import AlunoAdicao from "./AlunosAdicao";
import AlunosEdicao from "./AlunosEdicao";
import { SistemaContext, UsuarioContext } from "../../../contexts";
import { errors } from "../../../utils";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [adicionando, setAdicionando] = useState(false);
  const [selecionando, setSelecionando] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState({});
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const { carregando, error, confirma } = useRef(
    useContext(SistemaContext)
  ).current;
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  const nenhumAlunoSelecionado = alunosSelecionados.length === 0;
  const textoBotaoAdicionar = adicionando ? "Voltar" : "Adicionar";
  const textoBotaoSelecionar = selecionando
    ? nenhumAlunoSelecionado
      ? "Cancelar"
      : "Deletar"
    : "Selecionar";

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarAlunos(token)
      .then((res) => {
        setAlunos(res.data);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [token, error, carregando]);

  async function aoClicarSelecionar() {
    if (nenhumAlunoSelecionado) return setSelecionando(!selecionando);
    try {
      await aoDeletar();
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  }

  function aoClicarSelecionarAluno(aluno) {
    if (alunoSelecionado(aluno))
      setAlunosSelecionados((selecionados) =>
        selecionados.filter((p) => p.id_usuario !== aluno.id_usuario)
      );
    else setAlunosSelecionados((selecionados) => [...selecionados, aluno]);
  }

  function alunoSelecionado({ id_usuario }) {
    return alunosSelecionados.some((c) => c.id_usuario === id_usuario);
  }

  async function aoDeletar() {
    const resposta = await confirma(
      `Ao excluir esses alunos, todas as presenças marcadas
      e não marcadas associadas a eles serão perdidas.
      Recomenda-se realizar essa ação apenas após baixar
      e salvar todos os relatórios de presença, caso deseje
      iniciar um novo planejamento.`
    );
    if (!resposta) return;
    const ids = alunosSelecionados.map((p) => p.id_usuario);
    const alunosRestantes = alunos.filter((pr) => !alunoSelecionado(pr));
    try {
      await apiSFE.deletarAlunos(token, ids);
      setAlunos([...alunosRestantes]);
      setAlunosSelecionados([]);
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  }

  async function aoAdicionar(alunos) {
    const novosAlunos = alunos.map(({ nome, matricula }) => ({
      nome,
      login: matricula,
      senha: String(matricula), //TODO API deveria fazer isto e assegurar a conversão
    }));
    if (novosAlunos.length < 1) return;
    try {
      const { data } = await apiSFE.adicionarAlunos(token, novosAlunos);
      setAlunos(data);
    } catch (err) {
      throw err;
    }
  }

  async function aoEditar(novosDados) {
    try {
      await apiSFE.editarAlunos(token, novosDados);
      setAlunos((existentes) => {
        const index = existentes.findIndex(
          (p) => p.id_usuario === novosDados.id_usuario
        );
        existentes[index] = { ...existentes[index], ...novosDados };
        return existentes;
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  return (
    <Row className="justify-content-center w-100 m-0">
      <CardLinksBarraFixa>
        <BotaoTexto
          aoClicar={() => {
            setAdicionando(!adicionando);
          }}
          className="mb-2 me-3"
          texto={textoBotaoAdicionar}
          visivel={!alunoEmEdicao.id_usuario}
        />
        <BotaoTexto
          aoClicar={aoClicarSelecionar}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!adicionando && !alunoEmEdicao.id_usuario}
          assincrono
        />
        <BotaoTexto
          aoClicar={() => setAlunoEmEdicao({})}
          className="mb-2"
          texto={"Cancelar"}
          visivel={alunoEmEdicao.id_usuario}
        />
      </CardLinksBarraFixa>
      {adicionando ? (
        <AlunoAdicao
          alunos={alunos}
          aoAdicionarNovosAlunos={aoAdicionar}
          setAdicionando={setAdicionando}
        />
      ) : alunoEmEdicao.id_usuario ? (
        <AlunosEdicao
          aluno={alunoEmEdicao}
          aoSalvar={aoEditar}
          setAlunoEmEdicao={setAlunoEmEdicao}
        />
      ) : (
        <Col sm="12" xl="8">
          <TabelaPadrao
            numerado
            aoClicar={aoClicarSelecionarAluno}
            camposCabecalho={[
              { texto: "#", visivel: true },
              { texto: "Nome", visivel: true },
              { texto: "Matrícula", visivel: true },
              { texto: "Editar", visivel: true },
              { texto: "Deletar", visivel: selecionando },
            ]}
            campoDadoUnico="id_usuario"
            dados={alunos}
            camposDados={[
              { texto: "nome", visivel: true },
              { texto: "login", visivel: true },
              {
                funcaoComponente: (dado) => (
                  <label
                    type="button"
                    className="p-0"
                    onClick={() => setAlunoEmEdicao(dado)}
                  >
                    <FaUserEdit size={18} />
                  </label>
                ),
                visivel: true,
              },
              {
                check: true,
                visivel: selecionando,
                selecionado: alunoSelecionado,
              },
            ]}
          />
        </Col>
      )}
    </Row>
  );
}
