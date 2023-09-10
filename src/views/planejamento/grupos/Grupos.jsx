import { useState, useContext, useEffect, useRef } from "react";
import apiSFE from "../../../service/api";
import { UsuarioContext, SistemaContext } from "../../../contexts";
import GruposEdicao from "./GruposEdicao";
import { Col } from "react-bootstrap";
import {
  CardLinksBarraFixa,
  InputBotao,
  BotaoTexto,
  DivCabecalhoDeletar,
  TabelaPadrao,
} from "../../../componentes";
import uuid from "react-uuid";
import { errors } from "../../../utils";

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

  const { carregando, error } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarGrupos(token)
      .then((res) => setGrupos(res.data))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [usuario, token, error, carregando]);

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
    alunosSelecionados.some((a) => a.id_usuario === aluno.id_usuario);

  const aoSelecionarAluno = (aluno) => {
    let novosAlunos = alunosSelecionados;
    if (!alunoJaSelecionado(aluno)) novosAlunos.push(aluno);
    else {
      novosAlunos = alunosSelecionados.filter(
        (a) => a.id_usuario !== aluno.id_usuario
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
    const idsAlunos = alunosSelecionados.map(({ id_usuario }) => id_usuario);
    try {
      await apiSFE.desassociarAlunoGrupo(token, idsAlunos);
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
      <CardLinksBarraFixa>
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
      </CardLinksBarraFixa>
      {!editando ? (
        <>
          <Col sm="12" xl="8" className="mb-5">
            {grupos.map((grupo) => (
              <div className="mb-2" key={uuid()}>
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
                      { texto: "Desassociar", visivel: desassociando },
                    ]}
                    dados={grupo?.alunos}
                    campoDadosUnico="id_usuario"
                    camposDados={[
                      { texto: "nome", visivel: true },
                      { texto: "matricula", visivel: true },
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
