import { Col, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { amdEmData, dataEmDm } from "../../utils/datas";
import { useEffect, useState } from "react";
import {
  CheckDias,
  NumeroInput,
  IntervaloInput,
  DivCabecalhoDeletar,
  TextoInput,
  HoraInput,
} from "../index";
import uuid from "react-uuid";
import TextoCalendario from "../calendario/TextoCalendario";

const larguraInput = 200;
const larguraHora = 140;
const estiloTabela = { maxHeight: "250px" };

export default function CardAtividade({
  atividade,
  preceptores,
  locais,
  aoAlocarPreceptor,
  aoAlocarLocal,
  aoDeletarAtividade,
  aoEditarAtividade,
  grupos,
  numMaxDeAlunos,
  aoEditarDataDeAtividade,
}) {
  const [estaAtividade, setEstaAtividade] = useState({ subgrupos: [] });

  const possuiPreceptor = estaAtividade?.nome_preceptor !== null;
  const possuiLocal = estaAtividade?.nome_local !== null && possuiPreceptor;
  const possuiDatas = estaAtividade?.datas?.length > 0 && possuiLocal;
  const possuiHoraInicial = estaAtividade?.hora_inicial !== null && possuiDatas;
  const possuiHoraFinal =
    estaAtividade?.hora_final !== null && possuiHoraInicial;
  const possuiAlunos =
    estaAtividade?.intervalo_alunos !== null && possuiHoraFinal;
  const possuiAlunosNoDia =
    estaAtividade?.alunos_no_dia !== null && possuiAlunos;

  const indexPrimeiroAluno =
    parseInt(estaAtividade?.intervalo_alunos?.split("-")[0] ?? 1) - 1;
  const indexUltimoAluno =
    parseInt(estaAtividade?.intervalo_alunos?.split("-")[1] ?? numMaxDeAlunos) -
    1;

  const dias = {
    segunda: estaAtividade.segunda,
    terca: estaAtividade.terca,
    quarta: estaAtividade.quarta,
    quinta: estaAtividade.quinta,
    sexta: estaAtividade.sexta,
    sabado: estaAtividade.sabado,
    domingo: estaAtividade.domingo,
  };

  useEffect(() => {
    console.log(atividade);
    if (atividade === undefined || grupos === undefined) return;
    setEstaAtividade({
      ...atividade,
      grupos,
      datas: atividade.datas.map((d) => amdEmData(d.data)),
      eventos: atividade.datas,
    });
  }, [atividade, grupos]);

  const mudarNomePreceptor = async ({
    id_preceptor,
    nome_preceptor,
    id_atividade,
  }) => {
    try {
      await aoAlocarPreceptor({ id_preceptor, id_atividade });
      setEstaAtividade((estadoAtual) => {
        return { ...estadoAtual, nome_preceptor };
      });
    } catch (err) {
      throw err;
    }
  };

  const mudarNomeLocal = async ({ id_local, nome_local, id_atividade }) => {
    try {
      await aoAlocarLocal({ id_local, id_atividade });
      setEstaAtividade((estadoAtual) => ({ ...estadoAtual, nome_local }));
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarDatas = async (diasSemana) => {
    try {
      const atividadeAtualizada = (
        await aoEditarAtividade({
          id_atividade: atividade.id_atividade,
          ...diasSemana,
        })
      ).data;
      setEstaAtividade({
        ...atividadeAtualizada,
        eventos: atividadeAtualizada.datas,
      });
    } catch (err) {
      throw err;
    }
  };

  const mudarHoraInicial = async (hora_inicial) => {
    try {
      await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        hora_inicial,
      });
      setEstaAtividade((estadoAtual) => ({ ...estadoAtual, hora_inicial }));
    } catch (err) {
      throw err;
    }
  };

  const mudarHoraFinal = async (hora_final) => {
    try {
      await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        hora_final,
      });
      setEstaAtividade((estadoAtual) => ({ ...estadoAtual, hora_final }));
    } catch (err) {
      throw err;
    }
  };

  const mudarIntervalo = async (intervalo_alunos) => {
    try {
      const res = await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        intervalo_alunos,
      });
      const { subgrupos } = res.data;
      setEstaAtividade((estadoAtual) => ({
        ...estadoAtual,
        intervalo_alunos,
        subgrupos,
      }));
    } catch (err) {
      throw err;
    }
  };

  const mudarAlunosNoDia = async (alunos_no_dia) => {
    try {
      await aoEditarAtividade({
        id_atividade: atividade.id_atividade,
        alunos_no_dia,
      });
      setEstaAtividade((estadoAtual) => ({ ...estadoAtual, alunos_no_dia }));
    } catch (err) {
      throw err;
    }
  };

  const mudarDataDeAtividade = async ({ id_dataatividade, excluida }) => {
    try {
      await aoEditarDataDeAtividade({
        id_dataatividade,
        excluida: excluida ? 0 : 1,
      });
      setEstaAtividade((estadoAtual) => ({
        ...estadoAtual,
        eventos: estadoAtual.eventos.map((e) => {
          if (e.id_dataatividade === id_dataatividade)
            return { ...e, excluida: excluida ? 0 : 1 };
          return e;
        }),
      }));
    } catch (err) {
      throw err;
    }
  };

  return (
    <DivCabecalhoDeletar
      className="border rounded p-2"
      textoBotao="Deletar Atividade"
      titulo={estaAtividade.nome_atividade}
      aoDeletar={() =>
        aoDeletarAtividade({ id_atividade: estaAtividade.id_atividade })
      }
    >
      <Col sm="12" className="mb-1">
        <label className="me-2">Preceptor:</label>
        <TextoInput
          larguraMaxima={larguraInput}
          texto={estaAtividade.nome_preceptor}
          size="sm"
          id={`texto-input-preceptor${estaAtividade.nome_atividade}`}
          placeholder="Escolha o preceptor"
          labelKey="nome"
          emptyLabel="Nenhum registro"
          aoMudar={(preceptores) =>
            mudarNomePreceptor({
              id_preceptor: preceptores[0].id_preceptor,
              id_atividade: estaAtividade.id_atividade,
              nome_preceptor: preceptores[0].nome,
            })
          }
          opcoes={preceptores}
        />
      </Col>
      {possuiPreceptor && (
        <Col sm="12" className="mb-1">
          <label className="me-2">Local:</label>
          <TextoInput
            larguraMaxima={larguraInput}
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
      )}

      {possuiLocal && (
        <>
          <Col sm="12" className="mb-1">
            <span>Dias da semana:</span>
          </Col>
          <Col sm="12" className="mb-2 overflow-hidden">
            <CheckDias
              id={estaAtividade.id_atividade}
              dias={dias}
              aoMudar={aoAlocarDatas}
            />
          </Col>
        </>
      )}

      {possuiDatas && (
        <Col sm="12" className="mb-1">
          <span className="me-2">Hora inicial:</span>
          <HoraInput
            size="sm"
            texto={estaAtividade.hora_inicial}
            larguraMaxima={larguraHora}
            aoMudar={mudarHoraInicial}
          />
        </Col>
      )}
      {possuiHoraInicial && (
        <Col sm="12" className="mb-1">
          <span className="me-2">Hora final:</span>
          <HoraInput
            size="sm"
            texto={estaAtividade.hora_final}
            larguraMaxima={larguraHora}
            aoMudar={mudarHoraFinal}
          />
        </Col>
      )}
      {possuiHoraFinal && (
        <Col sm="12" className="mb-1">
          <span className="me-2">Alunos na atividade: </span>
          <IntervaloInput
            maximoValor={numMaxDeAlunos}
            size="sm"
            texto={estaAtividade.intervalo_alunos}
            larguraMaxima={larguraHora}
            aoMudar={mudarIntervalo}
          />
          {estaAtividade.subgrupos.map((subG, i) => (
            <OverlayTrigger
              key={uuid()}
              trigger="click"
              placement="bottom"
              overlay={
                //TODO Retirar o tooltip e mostrar tooltip explicando o que será feito com o valor digitado
                <Tooltip id={`tooltip-${i}`}>
                  <div style={estiloTabela} className="overflow-auto">
                    <Table variant="dark">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Aluno</th>
                          <th>Selecionado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subG?.alunos?.map((aluno, idx) => (
                          <tr key={uuid()}>
                            <td>{idx + 1}</td>
                            <td>{aluno.nome_aluno}</td>
                            <td>{aluno.aluno_incluido ? "Sim" : "Não"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tooltip>
              }
            >
              <label role="button" className="ms-2 me-2 text-primary">
                {dataEmDm(new Date(subG.data_inicial))}-
                {dataEmDm(new Date(subG.data_final))}
              </label>
            </OverlayTrigger>
          ))}
        </Col>
      )}
      {possuiAlunos && ( //TODO Colocar tooltip falando o que será feito com o valor colocado
        <Col sm="12" className="mb-1">
          <span className="me-2">Alunos por dia: </span>
          <NumeroInput
            texto={estaAtividade.alunos_no_dia}
            maximoValor={indexUltimoAluno - indexPrimeiroAluno + 1}
            aoMudar={mudarAlunosNoDia}
            larguraMaxima={larguraHora}
          />
        </Col>
      )}
      {possuiAlunosNoDia && (
        <Col sm="12" className="mb-1">
          <span className="me-2">Escolher datas de exceção: </span>
          <TextoCalendario
            eventos={estaAtividade.eventos}
            aoMudar={mudarDataDeAtividade}
          />
        </Col>
      )}
      <div className="mb-3" />
    </DivCabecalhoDeletar>
  );
}
