import React, { useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import FormData from "../../../componentes/formularios/FormData";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import { UsuarioContext } from "../../../filters/Usuario";
import apiSFE from "../../../service/api";
import { Col, Row, Table } from "react-bootstrap";
import {
  amdEmData,
  dataEmDma,
  comparaObjComDataInicial,
} from "../../../utils/datas";
import uuid from "react-uuid";
import { BotaoOutline, TextoInput } from "../../../componentes";

const styleColumnCoordenador = { width: "180px" };
const styleColumnGrupo = { width: "150px" };

export default function EstagiosEdicao({ estagios, setEstagios }) {
  const [coordenadores, setCoordenadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [datasComGrupos, setDatasComGrupos] = useState([]);

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  useEffect(() => {
    const datas = estagios
      ?.flatMap(({ id_estagio, grupos }) =>
        grupos.map(
          ({ data_inicial, data_final, id_grupo, nome, id_estagiogrupo }) => ({
            data_inicial: amdEmData(data_inicial),
            data_final: amdEmData(data_final),
            id_grupo,
            nome,
            id: id_estagio,
            id_estagiogrupo,
          })
        )
      )
      .sort(comparaObjComDataInicial);
    setDatasComGrupos(datas);
    const p_coordenadores = apiSFE.listarCoordenadores(token);
    const p_grupos = apiSFE.listarGrupos(token);
    Promise.all([p_coordenadores, p_grupos])
      .then((res) => {
        setCoordenadores(res[0].data);
        setGrupos(res[1].data);
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [alerta, token, estagios]);

  const aoAdicionarCoordenador = async ({ id_coordenador, id_estagio }) => {
    let dados = [{ id_estagio, id_coordenador }];
    try {
      await apiSFE.adicionarCoordenadoresAEstagios(token, dados);
      const res = await apiSFE.listarEstagios(token);
      setEstagios(res.data);
    } catch (err) {
      throw err;
    }
  };

  const dataJaAdicionada = (intervalo) => {
    return datasComGrupos.some(({ data_inicial }) => {
      return dataEmDma(data_inicial) === dataEmDma(intervalo.data_inicial);
    });
  };

  const aoAdicionarData = async (intervalo) => {
    if (dataJaAdicionada(intervalo))
      //TODO Essa verificação está muito simples.
      throw new Error("A data inicial escolhida já foi adicionada");

    try {
      const dados = estagios.map(({ id_estagio }) => ({
        id: id_estagio,
        id_estagio,
        ...intervalo,
      }));
      await apiSFE.adicionarGruposAEstagios(token, dados);
      const res = await apiSFE.listarEstagios(token);
      setEstagios(res.data);
    } catch (err) {
      throw err;
    }
  };

  const aoAlocarAutomatico = async () => {
    if (datasComGrupos.length === 0)
      return alerta.adicionaAlerta(new Error("Nenhuma data adicionada"));
    if (estagios?.length === 0)
      return alerta.adicionaAlerta(new Error("Nenhum estágio encontrado"));
    if (datasComGrupos.length !== grupos.length)
      alerta.adicionaAlerta(
        new Error(
          "O número de intervalos de datas deve ser igual a " + grupos.length
        )
      );
    else {
      try {
        const dados = [];
        const gruposAgrupados = [];
        for (let k = 0; k < grupos.length; k++) {
          const iteracao = gruposAgrupados.length;
          const vetorGrupo = [];
          const vetorAuxiliar = [];
          for (let i = 0; i < grupos.length; i++) {
            const ultimo = grupos.length - 1;
            if (iteracao >= i + 1) {
              vetorAuxiliar.push(grupos[i].id_grupo);
            } else if (i === ultimo) {
              vetorGrupo.push(grupos[i].id_grupo);
              gruposAgrupados.push(vetorGrupo.concat(vetorAuxiliar));
            } else {
              vetorGrupo.push(grupos[i].id_grupo);
            }
          }
        }
        const gruposOrdenados = gruposAgrupados.flat();
        const gruposDatas = [];
        for (let i = 0; i < gruposOrdenados.length; i++) {
          const dado = {};
          dado.id_grupo = gruposOrdenados[i];
          dado.data_inicial =
            datasComGrupos[i % datasComGrupos.length].data_inicial;
          dado.data_final =
            datasComGrupos[i % datasComGrupos.length].data_final;
          gruposDatas.push(dado);
        }
        for (let i = 0; i < estagios.length; i++) {
          const id_estagio = estagios[i].id_estagio;
          for (let j = 0; j < estagios.length; j++) {
            if (gruposDatas[i * estagios.length + j] === undefined) break;
            const dado = gruposDatas[i * estagios.length + j];
            dado.id_estagio = id_estagio;
            dados.push(dado);
          }
        }

        await apiSFE.adicionarGruposAEstagios(token, dados);
        const res = await apiSFE.listarEstagios(token);
        setEstagios(res.data);
      } catch (err) {
        throw err;
      }
    }
  };

  const aoAlocarGrupo = async (dado) => {
    try {
      await apiSFE.editarGrupoEmEstagio(token, [dado]);
      const res = await apiSFE.listarEstagios(token);
      setEstagios(res.data);
    } catch (err) {
      throw err;
    }
  };

  const aoLimparAlocacoes = async () => {
    try {
      const idsEstagioGrupo = estagios.flatMap(({ grupos }) =>
        grupos.map(({ id_estagiogrupo }) => id_estagiogrupo)
      );
      await apiSFE.deletarGruposDeEstagios(token, idsEstagioGrupo);
      const res = await apiSFE.listarEstagios(token);
      setEstagios(res.data);
    } catch (err) {
      throw err;
    }
  };

  return (
    <Row className="p-0 m-0 align-items-end justify-content-center">
      <Col sm="8" xl="6" className="mb-2">
        <FormData
          assincrono
          titulo="Escolha um intervalo"
          textoBotao="Adicionar"
          aoSelecionarDatas={aoAdicionarData}
        />
      </Col>
      <Col sm="4" xl="2" className="mb-2 d-flex justify-content-end">
        <BotaoOutline
          variant="primary"
          aoClicar={aoAlocarAutomatico}
          textoBotao="Alocação Automática"
        />
      </Col>
      <Col sm="12" xl="8" className="mb-2 d-flex justify-content-end">
        <BotaoOutline
          variant="danger"
          aoClicar={aoLimparAlocacoes}
          textoBotao="Limpar Alocações"
        />
      </Col>
      <Col sm="12" xl="8" className="mb-2">
        <Table striped hover>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Estágio</th>
              <th>Coordenador</th>
              <th>Data Inicial</th>
              <th>Data Final</th>
              <th>Grupo</th>
            </tr>
          </thead>
          <tbody>
            {estagios?.map(
              ({ id_estagio, nome_estagio, nome_coordenador }, i) => {
                const rowSpan =
                  datasComGrupos.filter(({ id }) => id === id_estagio).length +
                  1;
                return (
                  <React.Fragment key={uuid()}>
                    <tr className="text-center align-middle">
                      <td rowSpan={rowSpan}>{i + 1}</td>
                      <td rowSpan={rowSpan}>{nome_estagio}</td>
                      <td rowSpan={rowSpan} style={styleColumnCoordenador}>
                        <TextoInput
                          texto={nome_coordenador}
                          size="sm"
                          id="texto-input-coordenador"
                          placeholder="Escolha o coordenador"
                          labelKey="nome"
                          emptyLabel="Nenhum registro"
                          aoMudar={(coordenadores) =>
                            aoAdicionarCoordenador({
                              id_coordenador: coordenadores[0].id_coordenador,
                              id_estagio,
                            })
                          }
                          opcoes={coordenadores}
                        />
                      </td>
                    </tr>
                    {datasComGrupos
                      .filter(({ id }) => id === id_estagio)
                      .map(
                        ({
                          data_inicial,
                          data_final,
                          nome,
                          id_estagiogrupo,
                        }) => (
                          <tr className="text-center" key={uuid()}>
                            <td>{dataEmDma(data_inicial)}</td>
                            <td>{dataEmDma(data_final)}</td>
                            <td style={styleColumnGrupo}>
                              <TextoInput
                                texto={nome}
                                size="sm"
                                id={`texto-input-grupo${id_estagiogrupo}`}
                                placeholder="Escolha o grupo"
                                labelKey="nome_grupo"
                                emptyLabel="Nenhum registro"
                                aoMudar={(grupos) =>
                                  aoAlocarGrupo({
                                    id_estagiogrupo,
                                    id_grupo: grupos[0].id_grupo,
                                  })
                                }
                                opcoes={grupos}
                              />
                            </td>
                          </tr>
                        )
                      )}
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
