import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import { AlertaContext } from "../../../filters/alert/Alert";
import { UsuarioContext } from "../../../filters/User";
import apiSFE from "../../../service/api";
import { Col, Row } from "react-bootstrap";
import { CardLinksBarraFixa } from "../../../componentes/cards/CardLinks";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import { FaUserEdit } from "react-icons/fa";
import AlunoAdicao from "./AlunosAdicao";
import AlunosEdicao from "./AlunosEdicao";

export function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [adicionando, setAdicionando] = useState(false);
  const [selecionando, setSelecionando] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState({});
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  const nenhumAlunoSelecionado = alunosSelecionados.length === 0;
  const textoBotaoAdicionar = adicionando ? "Voltar" : "Adicionar";
  const textoBotaoSelecionar = selecionando
    ? nenhumAlunoSelecionado
      ? "Cancelar"
      : "Deletar"
    : "Selecionar";

  useEffect(() => {
    apiSFE
      .listarAlunos(token)
      .then((res) => {
        setAlunos(res.data);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      });
  }, [token, alerta]);

  async function aoClicarSelecionar() {
    if (nenhumAlunoSelecionado) return setSelecionando(!selecionando);
    try {
      await aoDeletar();
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  function aoClicarSelecionarAluno(aluno) {
    if (alunoSelecionado(aluno))
      setAlunosSelecionados((selecionados) =>
        selecionados.filter((p) => p.id_aluno !== aluno.id_aluno)
      );
    else
      setAlunosSelecionados((selecionados) => [
        ...selecionados,
        aluno,
      ]);
  }

  function alunoSelecionado({ id_aluno }) {
    return alunosSelecionados.some((c) => c.id_aluno === id_aluno);
  }

  async function aoDeletar() {
    const ids = alunosSelecionados.map((p) => p.id_aluno);
    const alunosRestantes = alunos.filter(
      (pr) => !alunoSelecionado(pr)
    );
    try {
      await apiSFE.deletarAlunos(token, ids);
      setAlunos([...alunosRestantes]);
      setAlunosSelecionados([]);
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  async function aoAdicionar(alunos) {
    const novosAlunos = alunos.map(({ nome, matricula }) => ({
      nome,
      matricula,
      senha: String(matricula), //TODO API deveria fazer isto e assegurar a conversão
    }));
    if (novosAlunos.length < 1) return;
    try {
      const { data } = await apiSFE.adicionarAlunos(
        token,
        novosAlunos
      );
      console.log(data);
      setAlunos(data);
    } catch (err) {
      throw err;
    }
  }

  async function aoEditar(novosDados) {
    console.log(novosDados);
    try {
      await apiSFE.editarAlunos(token, [novosDados]);
      setAlunos((existentes) => {
        const index = existentes.findIndex(
          (p) => p.id_aluno === novosDados.id_aluno
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
          visivel={!alunoEmEdicao.id_aluno}
        />
        <BotaoTexto
          aoClicar={aoClicarSelecionar}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!adicionando && !alunoEmEdicao.id_aluno}
          assincrono
        />
        <BotaoTexto
          aoClicar={() => setAlunoEmEdicao({})}
          className="mb-2"
          texto={"Cancelar"}
          visivel={alunoEmEdicao.id_aluno}
        />
      </CardLinksBarraFixa>
      {adicionando ? (
        <AlunoAdicao
          alunos={alunos}
          aoAdicionarNovosAlunos={aoAdicionar}
          setAdicionando={setAdicionando}
        />
      ) : alunoEmEdicao.id_aluno ? (
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
            campoDadoUnico="id_aluno"
            dados={alunos}
            camposDados={[
              { texto: "nome", visivel: true },
              { texto: "matricula", visivel: true },
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
