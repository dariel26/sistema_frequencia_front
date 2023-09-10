import { Col, Form, FormLabel, Row, Spinner } from "react-bootstrap";
import {
  CardSimples,
  InputSelecao,
  FormData,
  TabelaPadrao,
  CardSimplesBarraFixa,
  BotaoTexto,
} from "../../componentes";
import { useContext, useEffect, useRef, useState } from "react";
import { SistemaContext, UsuarioContext } from "../../contexts";
import apiSFE from "../../service/api";
import {
  amdEmData,
  dataEmAmd,
  dataEmDmahm,
  diferencaAbsEmHoras,
  errors,
  horarioEmData,
} from "../../utils";
import uuid from "react-uuid";

export const presencaEstados = {
  PRESENTE: "PRESENTE",
  ATESTADO: "ATESTADO",
  CRIADA: "CRIADA",
  REJEITADA: "REJEITADA",
};

const todasAtividades = { nome_atividade: "Todas", id_atividade: -1 };
const todosGrupos = { nome_grupo: "Todos", id_grupo: -1 };

const dataInicial = new Date();
const dataFinal = new Date();
dataInicial.setDate(dataInicial.getDate() - 1);

export default function GerirPresencas() {
  const [atividades, setAtividades] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [dataArarangua, setDataArarangua] = useState();
  const [grupos, setGrupos] = useState([]);
  const [presencaSalvando, setPresencaSalvando] = useState();

  const [filtroDatas, setFiltroDatas] = useState({
    data_inicial: dataInicial,
    data_final: dataFinal,
  });
  const [filtroGrupos, setFiltroGrupos] = useState(todosGrupos.id_grupo);
  const [filtroAtividades, setFiltroAtividades] = useState(
    todasAtividades.id_atividade
  );

  const { token } = useContext(UsuarioContext);
  const { error } = useRef(useContext(SistemaContext)).current;

  const presencasFiltradas = presencas.filter((p) => {
    const grupoFiltrado = grupos.find(
      ({ id_grupo }) => id_grupo === filtroGrupos
    );
    const filtroPorAtividade =
      filtroAtividades === -1 ? true : p.id_atividade === filtroAtividades;
    const filtroPorGrupos =
      grupoFiltrado === undefined
        ? true
        : grupoFiltrado.alunos.some((a) => a.id_usuario === p.id_usuario);

    return filtroPorAtividade && filtroPorGrupos;
  });

  useEffect(() => {
    if (token === undefined) return;
    const p_atividades = apiSFE.listarAtividades(token);
    const p_grupos = apiSFE.listarGrupos(token);
    Promise.all([p_atividades, p_grupos])
      .then((res) => {
        const atividades = res[0].data;
        const grupos = res[1].data;

        setAtividades(atividades);
        setGrupos(grupos);
      })
      .catch((err) => error(errors.filtraMensagem(err)));
  }, [token, error]);

  useEffect(() => {
    if (token === undefined) return;
    apiSFE
      .buscarPresencas(token, [
        filtroDatas.data_inicial,
        filtroDatas.data_final,
      ])
      .then((res) => {
        setPresencas(
          res.data.presencas.map((p) => ({
            ...p,
            data: dataEmAmd(new Date(p.data)),
          }))
        );
        setDataArarangua(new Date(res.data.dataAtual));
      })
      .catch((err) => error(errors.filtraMensagem(err)));
  }, [filtroDatas, token, error]);

  async function atualizar() {
    if (token === undefined) return;
    try {
      const res = await apiSFE.buscarPresencas(token, [
        filtroDatas.data_inicial,
        filtroDatas.data_final,
      ]);
      setPresencas(
        res.data.presencas.map((p) => ({
          ...p,
          data: dataEmAmd(new Date(p.data)),
        }))
      );
      setDataArarangua(new Date(res.data.dataAtual));
    } catch (err) {
      throw err;
    }
  }

  async function aoFiltrarAtividade(atividade) {
    setFiltroAtividades(atividade.id_atividade);
  }

  async function aoFiltrarGrupo(grupo) {
    setFiltroGrupos(grupo.id_grupo);
  }

  function aoFiltrarData(datas) {
    setFiltroDatas(datas);
  }

  function aoMudarEstado(presencaAtualizada) {
    setPresencaSalvando(presencaAtualizada.id_alunodataatividade);
    apiSFE
      .editarPresenca(token, presencaAtualizada)
      .then(() =>
        setPresencas((existentes) =>
          existentes.map((p) =>
            p.id_alunodataatividade === presencaAtualizada.id_alunodataatividade
              ? presencaAtualizada
              : p
          )
        )
      )
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setPresencaSalvando(null));
  }

  return (
    <CardSimples titulo="Gerir Presenças">
      <Row className="justify-content-center m-0">
        <CardSimplesBarraFixa>
          <BotaoTexto
            texto="Atualizar"
            visivel
            aoClicar={atualizar}
            assincrono
          />
        </CardSimplesBarraFixa>
        <Col sm="12" className="mb-2 text-center">
          <span className="fs-5 fw-bold">{dataEmDmahm(dataArarangua)}</span>
        </Col>
        <Col sm="12" lg="8" className="mt-2">
          <Row>
            <Col sm="12" md="6" className="mb-4">
              <FormLabel>Atividade</FormLabel>
              <InputSelecao
                textoBotao={"Filtrar"}
                opcoesSelecao={[todasAtividades, ...atividades]}
                textoInicial={todasAtividades.nome_atividade}
                campoSelecao="nome_atividade"
                aoSubmeter={aoFiltrarAtividade}
              />
            </Col>
            <Col sm="12" md="6" className="mb-4">
              <FormLabel>Grupos</FormLabel>
              <InputSelecao
                textoBotao={"Filtrar"}
                opcoesSelecao={[todosGrupos, ...grupos]}
                textoInicial={todosGrupos.nome_grupo}
                campoSelecao="nome_grupo"
                aoSubmeter={aoFiltrarGrupo}
              />
            </Col>
            <Col sm="12" md="12" className="mb-4">
              <FormLabel>Datas</FormLabel>
              <FormData
                textoBotao={"Filtrar"}
                aoSelecionarDatas={aoFiltrarData}
                data_inicial={dataInicial}
                data_final={dataFinal}
              />
            </Col>
          </Row>
        </Col>
        <Col sm="12" lg="8">
          <TabelaPadrao
            camposCabecalho={[
              { texto: "Data", visivel: true },
              { texto: "Hora", visivel: true },
              { texto: "Atividade", visivel: true },
              { texto: "Aluno", visivel: true },
              { texto: "Matrícula", visivel: true },
              { texto: "Estado", visivel: true },
            ]}
            camposDados={[
              { data: "data", visivel: true },
              { texto: "hora_inicial", visivel: true },
              { texto: "nome", visivel: true },
              { texto: "nome_aluno", visivel: true },
              { texto: "login", visivel: true },
              {
                funcaoComponente: (p) => {
                  const dataAtividade = horarioEmData(
                    amdEmData(p.data),
                    p.hora_inicial
                  );
                  const diferencaEmHoras = diferencaAbsEmHoras(
                    dataArarangua,
                    dataAtividade
                  );

                  const dataPassou = diferencaEmHoras < -2;

                  return p.excluida === 1 ? (
                    "Livre"
                  ) : presencaSalvando === p.id_alunodataatividade ? (
                    <Spinner size="sm" variant="primary" animation="grow"/>
                  ) : (
                    <Form>
                      {[
                        {
                          texto: "presente",
                          check: p.estado === presencaEstados.PRESENTE,
                          valor: presencaEstados.PRESENTE,
                        },
                        {
                          texto: "falta",
                          check:
                            (p.estado === presencaEstados.CRIADA &&
                              dataPassou) ||
                            p.estado === presencaEstados.REJEITADA,
                          valor: presencaEstados.REJEITADA,
                        },
                        {
                          texto: "atestado",
                          check: p.estado === presencaEstados.ATESTADO,
                          valor: presencaEstados.ATESTADO,
                        },
                      ].map((c) => (
                        <Form.Check
                          inline
                          name={p.id_alunodataatividade}
                          label={c.texto}
                          onChange={() =>
                            aoMudarEstado({ ...p, estado: c.valor })
                          }
                          checked={c.check}
                          type="radio"
                          key={uuid()}
                        />
                      ))}
                    </Form>
                  );
                },
                visivel: true,
              },
            ]}
            dados={presencasFiltradas}
          />
        </Col>
      </Row>
    </CardSimples>
  );
}
