import { useContext, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import CardRadios from "../components/cards/CardRadios";
import { AlertaContext } from "../filters/alert/Alert";
import { UsuarioContext } from "../filters/User";
import apiSFE from "../service/api";
import { formatarDataDM } from "../utils";
import {
  agruparDatasPorMes,
  amdEmData,
  encontrarMinEMaxDatas,
  obterPeriodoDoDia,
  periodos,
  todasAsDatasNoIntervalo,
} from "../utils/datas";
import gerarChaveUnica from "../utils/indexAleatorio";
import { FaFileDownload } from "react-icons/fa";
import { gerarArquivoXLSX } from "../utils/xlsx";

export default function Relatorio() {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [indexCabecalho, setIndexCabecalho] = useState(0);

  const usuario = useContext(UsuarioContext);
  const token = usuario.token;
  const alerta = useRef(useContext(AlertaContext)).current;

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
    ["Datas", " "].concat(datasNoMes.map((data) => formatarDataDM(data)))
  );

  const corposTabelas = [];
  cabecalhosTabelas?.forEach((cabecalho) => {
    const corpoTabela = [];
    grupos.forEach((grupo) => {
      let linha = [];
      linha.push(grupo.nome_grupo);
      cabecalho.slice(1).forEach((_) => linha.push(" "));
      corpoTabela.push(linha);
      linha = [];
      grupo.alunos.forEach((aluno) => {
        const datasDoAluno = alunos
          .find((a) => a.id_aluno === aluno.id_aluno)
          ?.datas?.map(({ data, hora_inicial, hora_final }) => ({
            dataDM: formatarDataDM(amdEmData(data)),
            hora_inicial,
            hora_final,
          }));
        const datasCabecalho = cabecalho.slice(2);
        const linhaManha = [periodos.MANHA];
        const linhaTarde = [periodos.TARDE];
        const linhaNoite = [periodos.NOITE];
        linha.push(aluno.nome);
        datasCabecalho.forEach((dataDM) => {
          const dataDMAluno = datasDoAluno.find((d) => d.dataDM === dataDM);
          if (!dataDMAluno) {
            linhaManha.push(" ");
            linhaTarde.push(" ");
            linhaNoite.push(" ");
          } else {
            const periodo = obterPeriodoDoDia(
              dataDMAluno.hora_inicial,
              dataDMAluno.hora_final
            );
            if (periodo === periodos.MANHA) {
              //TODO Verificar se aluno tem presenca e colocar 1
              linhaManha.push("0");
              linhaTarde.push(" ");
              linhaNoite.push(" ");
            } else if (periodo === periodos.TARDE) {
              //TODO Verificar se aluno tem presenca e colocar 1
              linhaManha.push(" ");
              linhaTarde.push("0");
              linhaNoite.push(" ");
            } else {
              //TODO Verificar se aluno tem presenca e colocar 1
              linhaManha.push(" ");
              linhaTarde.push(" ");
              linhaNoite.push("0");
            }
          }
        });
        linha.push([linhaManha, linhaTarde, linhaNoite]);
      });
      console.log(linha);
      corpoTabela.push(linha);
    });
    corposTabelas.push(corpoTabela);
  });

  const radios = cabecalhosTabelas?.map((cabecalho, indexCabecalho) => ({
    texto: `Mês ${cabecalho[cabecalho.length - 1]?.substring(3, 5)}`,
    indexCabecalho,
  }));

  useEffect(() => {
    const p_grupos = apiSFE.listarGrupos(token);
    const p_alunos = apiSFE.listarAlunos(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        setGrupos(res[0].data);
        setAlunos(res[1].data);
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [token, alerta]);

  const aoMudarRadio = (radioIndex) => {
    setIndexCabecalho(radios[radioIndex].indexCabecalho);
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
          onClick={() => gerarArquivoXLSX()}
          variant="primary"
          className="position-fixed bottom-0 end-0 mb-3 me-3 rounded-circle p-3"
          style={{ zIndex: "1030" }}
        >
          <FaFileDownload size={25} />
        </Button>
      </OverlayTrigger>

      <Row className="justify-content-center m-0">
        <Col sm="12" className="mb-4">
          <Table
            responsive
            size="sm"
            className="position-relative table-hover table-hover-column table-striped-columns"
          >
            <thead className="sticky t-0">
              <tr>
                {cabecalhosTabelas[indexCabecalho]?.map((dado, index) => (
                  <th
                    key={gerarChaveUnica()}
                    style={estiloStickyTd(index)}
                    className="bg-white text-center"
                  >
                    {dado}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corposTabelas[indexCabecalho]?.flatMap((linha) => {
                const segundoElem = linha[1];
                if (typeof segundoElem === typeof String()) {
                  return (
                    <tr key={gerarChaveUnica()}>
                      {linha?.map((str, index) => (
                        <td
                          className="text-nowrap fw-bold bg-primary text-light"
                          key={gerarChaveUnica()}
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
                      <tr key={gerarChaveUnica()}>
                        <td rowSpan={4} style={estiloStickyTd(0)}>
                          {dado}
                        </td>
                      </tr>
                    ) : (
                      dado.map((linha) => (
                        <tr key={gerarChaveUnica()} className="text-center">
                          {linha?.map((str) => (
                            <td key={gerarChaveUnica()}>{str}</td>
                          ))}
                        </tr>
                      ))
                    );
                  });
                }
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </CardRadios>
  );
}