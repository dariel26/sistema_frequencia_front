import { Button, Col, Row, Spinner } from "react-bootstrap";
import { BotaoTexto } from "../../componentes";
import { amdEmData, dataEmDma } from "../../utils/datas";
import { useContext, useEffect, useRef, useState } from "react";
import { AlertaContext } from "../../filters/alerta/Alerta";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/Usuario";

export default function PresencaAMarcar({ presenca, aoCancelar }) {
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });
  const [marcando, setMarcando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;
  const usuario = useContext(UsuarioContext);

  const erroNasCoordenadas = !coordenadas.lat || !coordenadas.lon;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const { latitude, longitude } = posicao.coords;
          setCoordenadas({ lat: latitude, lon: longitude });
        },
        (_) => {
          alerta.adicionaAlerta(
            new Error("Não foi possível obter a posição geográfica do usuário")
          );
        }
      );
    } else {
      alerta.adicionaAlerta(
        new Error("O navegador usado, não suporta geolocalização")
      );
    }
  }, [alerta]);

  const aoMarcarPresenca = (e) => {
    e.preventDefault();
    setMarcando(true);
    apiSFE
      .editarPresenca(usuario.token, {
        id_alunodataatividade: presenca.id_alunodataatividade,
        coordenadas,
        estado: 1,
      })
      .then((res) => {})
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setMarcando(false));
  };

  return (
    <>
      <Col sm="12" className="mb-2">
        <BotaoTexto texto="Cancelar" aoClicar={aoCancelar} visivel={true} />
      </Col>
      <Col sm="12" xl="8">
        <Row className="justify-content-center">
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Atividade</h6>
            <h6 className="fw-bold text-primary">{presenca.nome}</h6>
          </Col>
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Preceptor</h6>
            <h6 className="fw-bold text-primary">{presenca.nome_preceptor}</h6>
          </Col>
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Local</h6>
            <h6 className="fw-bold text-primary">{presenca.nome_local}</h6>
          </Col>
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Data</h6>
            <h6 className="fw-bold text-primary">
              {dataEmDma(amdEmData(presenca.data))}
            </h6>
          </Col>
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Horario de Entrada</h6>
            <h6 className="fw-bold text-primary">{presenca.hora_inicial}</h6>
          </Col>
          <Col sm="12" xl="6" className="text-center mb-2">
            <h6 className="mb-0">Local do usuário</h6>
            <h6 className="fw-bold text-primary">
              {erroNasCoordenadas ? "Local não encontrado" : "Local encontrado"}
            </h6>
          </Col>
          <Col sm="12" className="text-center">
            <Button onClick={aoMarcarPresenca}>
              {marcando && (
                <Spinner animation="grow" size="sm" className="me-2" />
              )}
              Marcar Presença
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
}
