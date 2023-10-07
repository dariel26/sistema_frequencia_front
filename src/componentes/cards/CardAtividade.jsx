import { Accordion, Col, ProgressBar, Row, Stack } from "react-bootstrap";
import {
  amdEmData,
  dataEmAmd,
  errors,
  extenderArray,
  filtraDatasPorIntervalo,
  moverParaPrimeiraPosicao,
  todasAsDatasNoIntervalo,
  obterPeriodoDoDia,
  separaDatasEmSemanas,
  sortDatas,
} from "../../utils";
import { useContext, useRef, useState } from "react";
import {
  DivCabecalhoDeletar,
  TextoInput,
  HoraInput,
  Calendario,
  InputChave,
  IntervaloInput,
  NumeroInput,
  CheckDias,
} from "../index";
import { SistemaContext, UsuarioContext } from "../../contexts";
import apiSFE from "../../service/api";

export default function CardAtividade({
  atividade,
  preceptores,
  coordenadores,
  aoDeletarAtividade,
  locais,
  grupos,
  numMaxDeAlunos,
}) {
  const { confirma } = useContext(SistemaContext);
  const calendarDataRef = useRef();
  const calendarAlunoRef = useRef();

  const { token } = useContext(UsuarioContext);
  const { error } = useContext(SistemaContext);

  const [estaAtividade, setEstaAtividade] = useState(
    normalizaAtividade(atividade)
  );

  const [diasNoPeriodo, setDiasNoPeriodo] = useState(true);
  const [intervaloDeAlunos, setIntervaloDeAlunos] = useState(
    `1-${numMaxDeAlunos}`
  );
  const [alunosNoDia, setAlunosNoDia] = useState(numMaxDeAlunos);
  const [alunoInicial, setAlunoInicial] = useState(1);

  const [intervaloDeSemanas, setIntervaloDeSemanas] = useState("1-8");
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);

  const indexPrimeiroAluno = intervaloDeAlunos.split("-")[0] - 1;
  const indexUltimoAluno = intervaloDeAlunos.split("-")[1] - 1;

  const indexPrimeiraSemana = intervaloDeSemanas.split("-")[0] - 1;
  const indexUltimaSemana = intervaloDeSemanas.split("-")[1] - 1;

  const textoDeAlunosNoDia =
    alunosNoDia === numMaxDeAlunos ? "Todos" : alunosNoDia;
  const textoDeIntervaloDeAlunos =
    indexPrimeiroAluno === 0 && indexUltimoAluno === numMaxDeAlunos - 1
      ? "Todos"
      : intervaloDeAlunos;

  const alunosNoDiaErro =
    indexUltimoAluno + 1 - indexPrimeiroAluno < alunosNoDia;
  const alunoInicialErro =
    alunoInicial > indexUltimoAluno + 1 ||
    alunoInicial < indexPrimeiroAluno + 1;

  let possiveisDatas = grupos.flatMap((g) =>
    todasAsDatasNoIntervalo(g.data_inicial, g.data_final).map((data) => ({
      data,
      nome: g.nome,
    }))
  );
  possiveisDatas = possiveisDatas.sort((a, b) =>
    a.data < b.data ? -1 : b.data < a.data ? 1 : 0
  );

  const todosOsAlunos = grupos.flatMap((g) => g.alunos);
  const alunosAlocados = todosOsAlunos.filter((a) =>
    estaAtividade.datas.some(({ alunos }) =>
      alunos.some((aluno) => aluno.id_aluno === a.id_usuario)
    )
  );
  const alunosNAlocados = todosOsAlunos.filter(
    (a) => !alunosAlocados.some((aluno) => aluno.id_usuario === a.id_usuario)
  );

  const eventosComAlunos = estaAtividade.datas
    .map(({ data: start }) => ({
      start,
      allDay: true,
      className: [
        datasSelecionadas.some((data) => dataEmAmd(start) === dataEmAmd(data))
          ? "bg-success"
          : "bg-secondary",
      ],
      display: "background",
    }))
    .concat(
      estaAtividade.datas
        .filter(({ alunos }) => alunos.length > 0)
        .map(({ data: start, alunos }) => ({
          title: alunos.map((a) => a.nome),
          start,
          className: ["bg-primary", "border-dark", "text-truncate"],
          allDay: true,
        }))
    );

  const mudarNomePreceptor = async ({
    id_usuario,
    nome_preceptor,
    id_atividade,
  }) => {
    try {
      await aoAlocarPreceptor({ id_usuario, id_atividade });
      setEstaAtividade((estadoAtual) => {
        return { ...estadoAtual, nome_preceptor };
      });
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  };

  const aoEditarAtividade = async (dado) => {
    try {
      return await apiSFE.editarAtividades(token, dado);
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarLocal = async ({ id_local, id_atividade }) => {
    try {
      await apiSFE.adicionarLocaisAAtividades(token, [
        { id_local, id_atividade },
      ]);
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarPreceptor = async ({ id_usuario, id_atividade }) => {
    try {
      await apiSFE.adicionarPreceptoresAAtividades(token, [
        { id_usuario, id_atividade },
      ]);
    } catch (err) {
      throw err;
    }
  };

  const mudarNomeLocal = async ({ id_local, nome_local, id_atividade }) => {
    try {
      await aoAlocarLocal({ id_local, id_atividade });
      setEstaAtividade((estadoAtual) => ({ ...estadoAtual, nome_local }));
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  };

  const mudarHoraInicial = async (hora_inicial) => {
    if (alunosAlocados.length > 0) {
      const resposta = await confirma(
        "Realizar esta mudança irá apagar os alunos alocados."
      );
      if (!resposta) return;
    }

    try {
      await apiSFE.deletarAlunoDataAtividade(token, estaAtividade.id_atividade);
      const res = await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        hora_inicial,
      });
      setEstaAtividade((estadoAtual) => ({
        ...estadoAtual,
        ...res.data,
        datas: estadoAtual.datas.map((d) => ({ ...d, alunos: [] })),
      }));
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  };

  const mudarHoraFinal = async (hora_final) => {
    if (alunosAlocados.length > 0) {
      const resposta = await confirma(
        "Realizar esta mudança irá apagar os alunos alocados."
      );
      if (!resposta) return;
    }

    try {
      await apiSFE.deletarAlunoDataAtividade(token, estaAtividade.id_atividade);
      const res = await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        hora_final,
      });
      console.log(res.data);
      setEstaAtividade((estadoAtual) => ({
        ...estadoAtual,
        ...res.data,
        datas: estadoAtual.datas.map((d) => ({ ...d, alunos: [] })),
      }));
    } catch (err) {
      error(errors.filtraMensagem(err));
    }
  };

  function fnDatasModificadas(dataReferencia, possiveisDatas) {
    const diaDaSemana = dataReferencia.getDay();
    const datasModificadas = diasNoPeriodo
      ? possiveisDatas.filter(({ data }) => data.getDay() === diaDaSemana)
      : [
          possiveisDatas.find(
            ({ data }) => dataEmAmd(data) === dataEmAmd(dataReferencia)
          ),
        ];
    return datasModificadas;
  }

  async function aoEscolherDatas({ start }) {
    const selecionada = atividadePossuiAData(start);
    const datasModificadas = fnDatasModificadas(start, possiveisDatas);

    try {
      if (selecionada) {
        const idsExcluir = estaAtividade.datas
          .filter(({ data }) =>
            datasModificadas.some((d) => dataEmAmd(d.data) === dataEmAmd(data))
          )
          .map(({ id_dataatividade }) => id_dataatividade);

        await apiSFE.deletarDatasDeAtividade(token, idsExcluir);
        setEstaAtividade((estaAtividade) => ({
          ...estaAtividade,
          datas: estaAtividade.datas.filter(
            ({ id_dataatividade }) => !idsExcluir.includes(id_dataatividade)
          ),
        }));
      } else {
        const novasDatas = datasModificadas
          .filter(
            (d) =>
              !estaAtividade.datas.some(
                ({ data }) => dataEmAmd(data) === dataEmAmd(d.data)
              )
          )
          .map((d) => d.data);

        await apiSFE.adicionarDatasAAtividade(
          token,
          novasDatas,
          estaAtividade.id_atividade
        );
        const res = await apiSFE.listarAtividades(token);
        setEstaAtividade((existente) =>
          normalizaAtividade(
            res.data.find((a) => a.id_atividade === existente.id_atividade)
          )
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async function aoAlocarAlunos({ start }) {
    const alunosDataAtividades = distribuicaoAlunos(
      start
    ).datasAtividadeComAlunos.map((dado) => ({
      id_usuario: dado.aluno.id_usuario,
      data: dado.data,
      id_atividade: estaAtividade.id_atividade,
      id_dataatividade: dado.id_dataatividade,
      periodo: obterPeriodoDoDia(
        estaAtividade.hora_inicial,
        estaAtividade.hora_final
      ),
    }));
    if (alunosDataAtividades.length < 1) return;

    try {
      await apiSFE.adicionarAlunoADataAtividade(token, alunosDataAtividades);
      const res = await apiSFE.listarAtividades(token);
      setEstaAtividade(
        normalizaAtividade(
          res.data.find((a) => a.id_atividade === estaAtividade.id_atividade)
        )
      );
    } catch (err) {
      throw err;
    }
  }

  function maxSemanas() {
    const grupos = gruposComSemanas();
    let qntdSemanas = 0;
    grupos.forEach(({ semanas }) => {
      if (qntdSemanas < semanas.length) qntdSemanas = semanas.length;
    });
    return qntdSemanas;
  }

  function atividadePossuiAData(d) {
    return estaAtividade.datas.some(
      ({ data }) => dataEmAmd(d) === dataEmAmd(data)
    );
  }

  function aoAbrirCalendarios(calendario) {
    if (calendario === "0")
      return setTimeout(() => {
        calendarDataRef.current.getApi().updateSize();
      }, 100);
    if (calendario === "1")
      return setTimeout(() => {
        calendarAlunoRef.current.getApi().updateSize();
      }, 100);
    if (calendario === "2") return;
  }

  function gruposComSemanas() {
    const gruposComSemanas = grupos.map((g) => {
      const datasDoGrupo = filtraDatasPorIntervalo(
        g.data_inicial,
        g.data_final,
        estaAtividade.datas.map((d) => d.data)
      );
      const semanas = separaDatasEmSemanas(datasDoGrupo);
      return { ...g, semanas };
    });
    return gruposComSemanas;
  }

  async function aoConfigurarDias(
    dias = diasSelecionados,
    semanas = intervaloDeSemanas
  ) {
    const indexPrimeiraSemana = semanas.split("-")[0] - 1;
    const indexUltimaSemana = semanas.split("-")[1] - 1;

    const datasFiltradas = await new Promise((resolve) => {
      const grupos = gruposComSemanas();
      const semanasFiltradas = grupos.flatMap(({ semanas }) =>
        semanas.slice(indexPrimeiraSemana, indexUltimaSemana + 1)
      );
      const datasFiltradas = semanasFiltradas.flatMap((datas) =>
        datas.filter((d) => dias.includes(d.getDay()))
      );
      setDiasSelecionados(dias);
      setIntervaloDeSemanas(semanas);
      resolve(datasFiltradas);
    });
    setDatasSelecionadas(datasFiltradas.sort(sortDatas));
  }

  function distribuicaoAlunos(data) {
    const grupos = gruposComSemanas();
    const distribuicao = [];
    const datasAtividadeComAlunos = [];

    if (
      datasSelecionadas.length > 0 && data &&
      !datasSelecionadas.some((d) => dataEmAmd(d) === dataEmAmd(data))
    )
      return { distribuicao, datasAtividadeComAlunos };

    grupos.forEach((g, index) => {
      distribuicao.push({ nome: g.nome, alunosPorData: [] });
      const numMaxAlunos = g.alunos.length;
      const indexFinal =
        indexUltimoAluno > numMaxAlunos - 1
          ? numMaxAlunos - 1
          : indexUltimoAluno;
      const maxAlunosNoDia =
        alunosNoDia > numMaxAlunos ? numMaxAlunos : alunosNoDia;

      const datasDoGrupoSelecionadas = g.semanas.flatMap((datas) =>
        datas.filter((data) =>
          datasSelecionadas.some((d) => dataEmAmd(d) === dataEmAmd(data))
        )
      );
      const idxAlunos = Array.from(
        { length: indexFinal - indexPrimeiroAluno + 1 },
        (_, idx) => idx + indexPrimeiroAluno + 1
      );

      if (datasDoGrupoSelecionadas.length > 0) {
        const idxAlunosExtendido = extenderArray(
          idxAlunos,
          maxAlunosNoDia * datasDoGrupoSelecionadas.length
        );
        const idxAlunosRefatorado = moverParaPrimeiraPosicao(
          idxAlunosExtendido,
          alunoInicial
        );
        datasDoGrupoSelecionadas.forEach((d, idx) => {
          const dataAtividadeCorrespondente = estaAtividade.datas.find(
            ({ data }) => dataEmAmd(data) === dataEmAmd(d)
          );
          const array = idxAlunosRefatorado.slice(
            idx * maxAlunosNoDia,
            (idx + 1) * maxAlunosNoDia
          );
          array.forEach((alunoNum) =>
            datasAtividadeComAlunos.push({
              ...dataAtividadeCorrespondente,
              aluno: g.alunos.find((_, index) => index === alunoNum - 1),
            })
          );
          distribuicao[index].alunosPorData.push(`[${array}]`);
        });
      } else {
        const idxAlunosExtendido = extenderArray(idxAlunos, maxAlunosNoDia);
        const array = moverParaPrimeiraPosicao(
          idxAlunosExtendido,
          alunoInicial
        );
        distribuicao[index].alunosPorData.push(`[${array}]`);

        if (
          g.semanas.some((datas) =>
            datas.some((d) => dataEmAmd(d) === dataEmAmd(data))
          )
        ) {
          const dataAtividadeCorrespondente = estaAtividade.datas.find(
            (da) => dataEmAmd(data) === dataEmAmd(da.data)
          );
          array.forEach((alunoNum) =>
            datasAtividadeComAlunos.push({
              ...dataAtividadeCorrespondente,
              aluno: g.alunos.find((_, index) => index === alunoNum - 1),
            })
          );
        }
      }
    });
    return { distribuicao, datasAtividadeComAlunos };
  }

  return (
    <DivCabecalhoDeletar
      className={`border rounded p-2 position-relative pb-1 border-2 ${
        alunosNAlocados.length > 0 ? "border-secondary" : "border-primary"
      }`}
      textoBotao="Deletar Atividade"
      titulo={estaAtividade.nome_atividade}
      aoDeletar={() =>
        aoDeletarAtividade({ id_atividade: estaAtividade.id_atividade })
      }
    >
      <Col sm="12" className="mb-1">
        <label className="me-2">Preceptor:</label>
        <TextoInput
          texto={estaAtividade.nome_preceptor}
          size="sm"
          id={`texto-input-preceptor${estaAtividade.nome_atividade}`}
          placeholder="Escolha o preceptor"
          labelKey="nome"
          emptyLabel="Nenhum registro"
          aoMudar={(preceptores) =>
            mudarNomePreceptor({
              id_usuario: preceptores[0].id_usuario,
              id_atividade: estaAtividade.id_atividade,
              nome_preceptor: preceptores[0].nome,
            })
          }
          opcoes={preceptores.concat(coordenadores)}
        />
      </Col>

      <Col sm="12" className="mb-1">
        <label className="me-2">Local:</label>
        <TextoInput
          texto={estaAtividade.nome_local}
          size="sm"
          id={`texto-input-local${estaAtividade.nome_atividade}`}
          placeholder="Escolha o local"
          labelKey="nome"
          emptyLabel="Nenhum registro"
          aoMudar={(locais) =>
            mudarNomeLocal({
              id_local: locais[0].id_local,
              id_atividade: estaAtividade.id_atividade,
              nome_local: locais[0].nome,
            })
          }
          opcoes={locais}
        />
      </Col>

      <Col sm="12" className="mb-1">
        <span className="me-2">Hora inicial:</span>
        <HoraInput
          size="sm"
          texto={estaAtividade.hora_inicial}
          aoMudar={mudarHoraInicial}
        />
      </Col>

      <Col sm="12" className="mb-1">
        <span className="me-2">Hora final:</span>

        <HoraInput
          size="sm"
          texto={estaAtividade.hora_final}
          aoMudar={mudarHoraFinal}
        />

        {estaAtividade.periodo && (
          <span className="text-secondary ms-2">{estaAtividade.periodo}</span>
        )}
      </Col>

      <Accordion onSelect={aoAbrirCalendarios}>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="p-0">
            Escolha as datas da atividade
          </Accordion.Header>
          <Accordion.Body>
            <div className="overflow-hidden">
              <InputChave
                textoVerdade="Modificando colunas de datas"
                textoFalso="Modificando data específica"
                aoMudar={(mudou) => setDiasNoPeriodo(mudou)}
                valorInicial={diasNoPeriodo}
              />
              <Calendario
                altura={500}
                callendarRef={calendarDataRef}
                aoClicarData={aoEscolherDatas}
                eventos={possiveisDatas.map(({ data, nome }) => ({
                  title: nome,
                  start: data,
                  allDay: true,
                  className: [
                    atividadePossuiAData(data) ? "bg-success" : "bg-secondary",
                  ],
                  display: "background",
                }))}
                dataInicial={possiveisDatas[0]?.data}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Aloque os alunos nas datas da atividade
          </Accordion.Header>
          <Accordion.Body>
            <div className="overflow-hidden">
              <Row className="m-0 border-bottom">
                <Col sm="12">
                  <strong>Configuração de alunos:</strong>
                </Col>
                <Col sm="4" className="mt-2 mb-2">
                  <span className="me-2">Intervalo de alunos:</span>
                  <IntervaloInput
                    texto={textoDeIntervaloDeAlunos}
                    valorReal={intervaloDeAlunos}
                    size="sm"
                    maximoValor={numMaxDeAlunos}
                    assincrono={false}
                    aoMudar={(valor) => setIntervaloDeAlunos(valor)}
                  />
                </Col>
                <Col sm="4" className="mt-2 mb-2">
                  <span className="me-2">Alunos por dia:</span>
                  <NumeroInput
                    texto={textoDeAlunosNoDia}
                    valorReal={alunosNoDia}
                    sinalizarErro={alunosNoDiaErro}
                    size="sm"
                    maximoValor={indexUltimoAluno - indexPrimeiroAluno + 1}
                    assincrono={false}
                    aoMudar={(valor) => setAlunosNoDia(valor)}
                  />
                </Col>
                <Col sm="4" className="mt-2 mb-2">
                  <span className="me-2">Aluno inicial:</span>
                  <NumeroInput
                    texto={alunoInicial}
                    valorReal={alunoInicial}
                    sinalizarErro={alunoInicialErro}
                    size="sm"
                    minimoValor={indexPrimeiroAluno + 1}
                    maximoValor={indexUltimoAluno + 1}
                    assincrono={false}
                    aoMudar={(valor) => setAlunoInicial(valor)}
                  />
                </Col>
                <Col sm="12" className="mb-2">
                  <Stack>
                    <span>
                      Como irão ser distribuidos os alunos por dias
                      selecionados:
                    </span>

                    {distribuicaoAlunos().distribuicao.map(
                      ({ nome, alunosPorData }) => (
                        <code key={nome}>
                          <p className="m-0 mb-1 text-truncate">
                            <span>
                              {nome}: <span>{alunosPorData}</span>
                            </span>
                          </p>
                        </code>
                      )
                    )}
                  </Stack>
                </Col>
              </Row>
              <Row className="m-0 border-bottom mt-2">
                <Col sm="12">
                  <strong>Configuração de datas:</strong>
                </Col>
                <Col sm="12" className="mt-2 mb-2">
                  <span className="me-2">Intervalo de semanas:</span>
                  <IntervaloInput
                    texto={intervaloDeSemanas}
                    valorReal={intervaloDeSemanas}
                    sinalizaErro={
                      indexUltimaSemana > maxSemanas() - 1 ||
                      indexPrimeiraSemana < 0
                    }
                    size="sm"
                    maximoValor={maxSemanas()}
                    assincrono={false}
                    aoMudar={(valor) => aoConfigurarDias(undefined, valor)}
                  />
                </Col>
                <Col sm="12" className="mb-2">
                  <p className="m-0">
                    {diasSelecionados.length === 0
                      ? "Somente nos dias clicados individualmente."
                      : "Em todos os:"}
                  </p>
                  <CheckDias
                    aoMudar={aoConfigurarDias}
                    id={estaAtividade.id_atividade}
                  />
                </Col>
              </Row>

              <Calendario
                altura={500}
                callendarRef={calendarAlunoRef}
                aoClicarData={aoAlocarAlunos}
                eventos={eventosComAlunos}
                dataInicial={possiveisDatas[0]?.data}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <ProgressBar className="mt-1">
        <ProgressBar
          now={
            ((estaAtividade.nome_preceptor ? 1 : 0) * 100) /
              todosOsAlunos.length +
            4
          }
          variant={estaAtividade.nome_preceptor ? "primary" : "secondary"}
          animated
          key={1}
          label={`Preceptor: ${estaAtividade.nome_preceptor ? "1" : "0"}/1`}
        />
        <ProgressBar
          now={
            ((estaAtividade.nome_local ? 1 : 0) * 100) / todosOsAlunos.length +
            4
          }
          variant={estaAtividade.nome_local ? "primary" : "secondary"}
          animated
          key={2}
          label={`Local: ${estaAtividade.nome_local ? "1" : "0"}/1`}
        />
        <ProgressBar
          now={
            (((estaAtividade.hora_inicial ? 1 : 0) +
              (estaAtividade.hora_final ? 1 : 0)) *
              100) /
              todosOsAlunos.length +
            4
          }
          variant={
            estaAtividade.hora_final && estaAtividade.hora_inicial
              ? "primary"
              : "secondary"
          }
          animated
          key={3}
          label={`Horarios: ${
            (estaAtividade.hora_inicial ? 1 : 0) +
            (estaAtividade.hora_final ? 1 : 0)
          }/2`}
        />
        <ProgressBar
          now={(alunosAlocados.length * 100) / todosOsAlunos.length + 4}
          animated
          key={4}
          variant={alunosNAlocados.length > 0 ? "secondary" : "primary"}
          label={`Alunos: ${alunosAlocados.length}/${todosOsAlunos.length}`}
        />
      </ProgressBar>
    </DivCabecalhoDeletar>
  );
}

function normalizaAtividade(atividade) {
  return {
    ...atividade,
    datas: atividade.datas.map((d) => ({
      ...d,
      data: amdEmData(d.data),
    })),
  };
}
