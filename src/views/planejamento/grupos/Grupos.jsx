import { useState, useContext, useEffect, useRef } from "react";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import apiSFE from "../../../service/api";
import { UsuarioContext } from "../../../filters/Usuario";
import InputBotao from "../../../componentes/inputs/InputBotao";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../../componentes/divs/DivCabecalhoDeletar";
import { gerarChaveUnica } from "../../../utils";
import { CardRadiosBarraFixa } from "../../../components/cards/CardRadios";
import GruposEdicao from "./GruposEdicao";
import { Col } from "react-bootstrap";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [editando, setEditando] = useState(false);
  const [desassociando, setDesassociando] = useState(false);

  const nenhumGrupoSalvo = grupos.length === 0;
  const haAlunosSelecionados = alunosSelecionados.length > 0;
  const textoBotaoEditar = editando ? "Voltar" : "Editar";
  const textoBotaoDeletar = desassociando
    ? haAlunosSelecionados
      ? "Desassociar"
      : "Cancelar"
    : "Selecionar";

  const alerta = useRef(useContext(AlertaContext)).current;
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  useEffect(() => {
    apiSFE
      .listarGrupos(token)
      .then((res) => setGrupos(res.data))
      .catch((err) => {
        alerta.adicionaAlerta(err);
      });
  }, [usuario, token, alerta]);

  const aoCriarGrupo = async (nome) => {
    try {
      const res = await apiSFE.adicionarGrupos(token, [{ nome }]);
      setGrupos(res.data);
      return "Grupo salvo!";
    } catch (err) {
      throw err;
    }
  };

  const alunoJaSelecionado = (aluno) =>
    alunosSelecionados.some((a) => a.id_aluno === aluno.id_aluno);

  const aoSelecionarAluno = (aluno) => {
    let novosAlunos = alunosSelecionados;
    if (!alunoJaSelecionado(aluno)) novosAlunos.push(aluno);
    else {
      novosAlunos = alunosSelecionados.filter(
        (a) => a.id_aluno !== aluno.id_aluno
      );
    }
    setAlunosSelecionados(Object.assign([], novosAlunos));
  };

  const aoDeletarGrupo = async ({ id_grupo }) => {
    try {
      await apiSFE.deletarGrupos(token, [id_grupo]);
      setGrupos((existentes) =>
        existentes.filter((g) => g.id_grupo !== id_grupo)
      );
      return "Grupo deletado!";
    } catch (err) {
      throw err;
    }
  };

  const aoClicarDesassociarAluno = async () => {
    if (!haAlunosSelecionados) {
      setDesassociando(!desassociando);
      return;
    }
    const novosDados = alunosSelecionados.map(({ id_aluno }) => ({
      id_aluno,
      id_grupo: null,
    }));
    try {
      await apiSFE.editarAlunos(token, novosDados);
      const res = await apiSFE.listarGrupos(token);
      setAlunosSelecionados([]);
      setGrupos(res.data);
      return "Os alunos foram retirados do grupo!";
    } catch (err) {
      throw err;
    }
  };

  const atualizarGrupos = async (novosDados) => {
    try {
      const res = await apiSFE.listarGrupos(token);
      setGrupos(res.data);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <CardRadiosBarraFixa>
        <BotaoTexto
          aoClicar={() => {
            setEditando(!editando);
          }}
          className="mb-2 me-3"
          texto={textoBotaoEditar}
          visivel={!nenhumGrupoSalvo}
        />
        <BotaoTexto
          aoClicar={aoClicarDesassociarAluno}
          className="mb-2"
          texto={textoBotaoDeletar}
          visivel={!editando}
          assincrono
        />
      </CardRadiosBarraFixa>
      {!editando ? (
        <>
          <Col sm="12" xl="8" className="mb-5">
            {grupos.map((grupo) => (
              <div className="mb-2" key={gerarChaveUnica()}>
                <DivCabecalhoDeletar
                  titulo={grupo.nome_grupo}
                  textoBotao="Deletar Grupo"
                  aoDeletar={() => aoDeletarGrupo(grupo)}
                >
                  <TabelaPadrao
                    aoClicar={(aluno) => aoSelecionarAluno(aluno)}
                    numerado
                    camposCabecalho={[
                      { texto: "#", visivel: true },
                      { texto: "Nome", visivel: true },
                      { texto: "Matricula", visivel: true },
                      { texto: "id_aluno", visivel: true },
                      { texto: "Desassociar", visivel: desassociando },
                    ]}
                    dados={grupo?.alunos}
                    campoDadosUnico="id_aluno"
                    camposDados={[
                      { texto: "nome", visivel: true },
                      { texto: "matricula", visivel: true },
                      {texto: "id_aluno", visivel: true},
                      {
                        check: true,
                        selecionado: (aluno) => alunoJaSelecionado(aluno),
                        visivel: desassociando,
                      },
                    ]}
                  />
                </DivCabecalhoDeletar>
              </div>
            ))}
          </Col>
          <Col sm="12" xl="8">
            <InputBotao
              textoReferencia={"Nome do grupo"}
              maximaLargura={300}
              aoClicar={aoCriarGrupo}
            />
          </Col>
        </>
      ) : (
        <GruposEdicao atualizarGrupos={atualizarGrupos} />
      )}
    </div>
  );
}
