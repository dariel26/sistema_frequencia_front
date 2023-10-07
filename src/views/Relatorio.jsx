import { useContext, useRef, useState, useEffect } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { UsuarioContext, SistemaContext } from "../contexts";
import apiSFE from "../service/api";
import {
  agruparDatasPorMes,
  amdEmData,
  dataEmDm,
  encontrarMinEMaxDatas,
  obterPeriodoDoDia,
  periodos,
  todasAsDatasNoIntervalo,
  errors,
  gerarArquivoXLSX,
} from "../utils";
import { FaFileDownload } from "react-icons/fa";
import { CardRadios } from "../componentes";
import uuid from "react-uuid";
import { presencaEstados } from "./gerir_presenca/GerirPresencas";

export default function Relatorio() {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [indexTabela, setIndexTabela] = useState(0);

  const { carregando, error } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  const nenhumDadoAMostrar =
    grupos.length === 0 ||
    alunos.length === 0 ||
    grupos[0]?.estagios?.length === 0;

  const datasEstagios =
    grupos[0]?.estagios.flatMap(({ data_inicial, data_final }) => [
      amdEmData(data_inicial),
      amdEmData(data_final),
    ]) ?? [];

  const dataInicio = encontrarMinEMaxDatas(datasEstagios)[0];
  const dataFim = encontrarMinEMaxDatas(datasEstagios)[1];

  const todasDatas = todasAsDatasNoIntervalo(dataInicio, dataFim);
  const datasPorMes = agruparDatasPorMes(todasDatas);

  const cabecalhosTabelas = datasPorMes.map((datasNoMes) =>
    ["Datas", " "].concat(datasNoMes.map((data) => dataEmDm(data)))
  );

  const corposTabelas = [];
  cabecalhosTabelas?.forEach((cabecalho) => {
    const corpoTabela = [];
    grupos?.forEach((grupo) => {
      let linha = [];
      linha.push(grupo.nome_grupo);
      cabecalho.slice(1)?.forEach((_) => linha.push(" "));
      corpoTabela.push(linha);
      linha = [];
      grupo.alunos.forEach((aluno) => {
        const datasDoAluno = alunos
          .find((a) => a.id_usuario === aluno.id_usuario)
          ?.datas?.map(
            ({ data, hora_inicial, hora_final, estado, excluida }) => ({
              dataDM: dataEmDm(amdEmData(data)),
              hora_inicial,
              hora_final,
              estado,
              excluida,
            })
          );
        const datasCabecalho = cabecalho.slice(2);
        const linhaManha = [periodos.MANHA];
        const linhaTarde = [periodos.TARDE];
        const linhaNoite = [periodos.NOITE];
        linha.push(aluno.nome);
        datasCabecalho.forEach((dataDM) => {
          const datasDMAluno = datasDoAluno.filter((d) => d.dataDM === dataDM);
          if (datasDMAluno.length < 1) {
            linhaManha.push(" ");
            linhaTarde.push(" ");
            linhaNoite.push(" ");
          } else {
            const tempos = { manha: false, tarde: false, noite: false };
            for (let dataDMAluno of datasDMAluno) {
              const periodo = obterPeriodoDoDia(
                dataDMAluno.hora_inicial,
                dataDMAluno.hora_final
              );
              if (periodo === periodos.MANHA) {
                linhaManha.push(
                  dataDMAluno.excluida
                    ? "livre"
                    : dataDMAluno.estado === presencaEstados.CRIADA ||
                      dataDMAluno.estado === presencaEstados.REJEITADA
                    ? 0
                    : 1
                );
                tempos.manha = true;
              } else if (periodo === periodos.TARDE) {
                linhaTarde.push(
                  dataDMAluno.excluida
                    ? "livre"
                    : dataDMAluno.estado === presencaEstados.CRIADA ||
                      dataDMAluno.estado === presencaEstados.REJEITADA
                    ? 0
                    : 1
                );
                tempos.tarde = true;
              } else if (periodo === periodos.NOITE) {
                linhaNoite.push(
                  dataDMAluno.excluida
                    ? "livre"
                    : dataDMAluno.estado === presencaEstados.CRIADA ||
                      dataDMAluno.estado === presencaEstados.REJEITADA
                    ? 0
                    : 1
                );
                tempos.noite = true;
              }
            }
            if (!tempos.manha) {
              linhaManha.push(" ");
            }
            if (!tempos.tarde) {
              linhaTarde.push(" ");
            }
            if (!tempos.noite) {
              linhaNoite.push(" ");
            }
          }
        });
        linha.push([linhaManha, linhaTarde, linhaNoite]);
      });
      corpoTabela.push(linha);
    });
    corposTabelas.push(corpoTabela);
  });

  const linhasCorpo = corposTabelas[indexTabela]?.map((linha) => {
    if (typeof linha[1] === typeof String()) {
      return linha;
    } else {
      let aluno = "";
      const dadosFormatados = [];
      linha.forEach((dado, i) => {
        if (i % 2 === 0) {
          aluno = dado;
        } else {
          dadosFormatados.push([aluno, ...dado[0]]);
          dadosFormatados.push([" "].concat(dado[1]));
          dadosFormatados.push([" "].concat(dado[2]));
        }
      });
      return dadosFormatados;
    }
  });

  const dados = [cabecalhosTabelas[indexTabela]].concat(linhasCorpo);

  const radios = cabecalhosTabelas?.map((cabecalho, indexCabecalho) => ({
    texto: `Mês ${cabecalho[cabecalho.length - 1]?.substring(3, 5)}`,
    indexCabecalho,
  }));

  useEffect(() => {
    carregando(true);
    const p_grupos = apiSFE.listarGrupos(token);
    const p_alunos = apiSFE.listarAlunos(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        setGrupos(res[0].data);
        setAlunos(res[1].data);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [token, error, carregando]);

  const aoMudarRadio = (radioIndex) => {
    setIndexTabela(radios[radioIndex].indexCabecalho);
  };

  const estiloStickyTd = (index) => {
    return index === 0
      ? { position: "sticky", left: "0px", zIndex: "1020" }
      : {};
  };

  return (
    <CardRadios
      title={"Relatório"}
      radios={radios.map((r) => r.texto)}
      newIndex={aoMudarRadio}
    >
      <OverlayTrigger overlay={<Tooltip>Baixar planilha</Tooltip>}>
        <Button
          onClick={() => gerarArquivoXLSX(dados)}
          variant="primary"
          hidden={nenhumDadoAMostrar}
          className="position-fixed bottom-0 end-0 mb-3 me-3 rounded-circle p-3 shadow"
          style={{ zIndex: "1030" }}
        >
          <FaFileDownload size={25} />
        </Button>
      </OverlayTrigger>

      <Row className="justify-content-center m-0">
        <Col sm="12" className="mb-4 text-center">
          {nenhumDadoAMostrar ? (
            <span className="fs-5 w-100 fw-bold">
              Nenhum registro a ser mostrado
            </span>
          ) : (
            <Table
              responsive
              size="sm"
              className="position-relative table-hover table-hover-column table-striped-columns"
            >
              <thead>
                <tr>
                  {cabecalhosTabelas[indexTabela]?.map((dado, index) => (
                    <th
                      key={uuid()}
                      style={estiloStickyTd(index)}
                      className="bg-white text-center"
                    >
                      {dado}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {corposTabelas[indexTabela]?.flatMap((linha) => {
                  const segundoElem = linha[1];
                  if (typeof segundoElem === typeof String()) {
                    return (
                      <tr key={uuid()}>
                        {linha?.map((str, index) => (
                          <td
                            className="text-nowrap fw-bold bg-primary text-light"
                            key={uuid()}
                            style={estiloStickyTd(index)}
                          >
                            {str}
                          </td>
                        ))}
                      </tr>
                    );
                  } else {
                    return linha?.map((dado) => {
                      const blString = typeof dado === typeof String();
                      return blString ? (
                        <tr key={uuid()}>
                          <td rowSpan={4} style={estiloStickyTd(0)}>
                            {dado}
                          </td>
                        </tr>
                      ) : (
                        dado.map((linha) => (
                          <tr key={uuid()} className="text-center">
                            {linha?.map((str) => (
                              <td key={uuid()}>{str}</td>
                            ))}
                          </tr>
                        ))
                      );
                    });
                  }
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </CardRadios>
  );
}
