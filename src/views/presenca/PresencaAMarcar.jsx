import { Button, Col, Row, Spinner } from "react-bootstrap";
import { amdEmData, dataEmDma, errors } from "../../utils";
import { useContext, useRef, useState } from "react";
import apiSFE from "../../service/api";
import { UsuarioContext, SistemaContext } from "../../contexts";

export default function PresencaAMarcar({
  presenca,
  coordenadas,
  setPresencas,
  aoCancelar,
}) {
  const [marcando, setMarcando] = useState(false);

  const { error, sucesso } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);

  const erroNasCoordenadas = !coordenadas.lat || !coordenadas.lon;

  const aoMarcarPresenca = (e) => {
    e.preventDefault();
    setMarcando(true);
    apiSFE
      .marcarPresenca(usuario.token, {
        id_alunodataatividade: presenca.id_alunodataatividade,
        coordenadas,
        estado: "PRESENTE",
      })
      .then(() => {
        setPresencas((antigas) =>
          antigas.map((p) =>
            p.id_alunodataatividade === presenca.id_alunodataatividade
              ? { ...p, estado: "PRESENTE" }
              : p
          )
        );
        sucesso("Presença marcada");
        aoCancelar();
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setMarcando(false));
  };

  return (
    <>
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
