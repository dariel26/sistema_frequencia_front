import { useContext, useEffect, useState } from "react";
import { Col, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import Calendario from "./Calendario";
import { amdEmData, dataEmAmd, dataEmDma, errors } from "../../utils";
import uuid from "react-uuid";
import { SistemaContext } from "../../contexts";

const corEscolhida = "#48E866";
const corAnulada = "#E84862";

export default function TextoCalendario({ aoMudar, eventos }) {
  const [eventosFormatados, setEventosFormatados] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [mudando, setMudando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);

  const datasExcluidas = eventos ? eventos.filter((e) => e.excluida) : [];

  useEffect(() => {
    const eventosFormatados = eventos?.map(
      ({ data, excluida, id_dataatividade }) => ({
        allDay: true,
        start: amdEmData(data),
        end: amdEmData(data),
        display: "background",
        color: excluida ? corAnulada : corEscolhida,
        id_dataatividade,
        excluida,
      })
    );
    setEventosFormatados(eventosFormatados);
  }, [eventos]);

  function aoClicar() {
    setMudando(!mudando);
  }

  function aoClicarEmEvento({ date }) {
    if (salvando) return;

    const eventoClicado = eventosFormatados.find(
      ({ start }) => dataEmAmd(start) === dataEmAmd(date)
    );

    if (eventoClicado === undefined) return;

    setSalvando(true);
    aoMudar(eventoClicado)
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setSalvando(false));
  }

  return (
    <>
      <label role="button" onClick={aoClicar} className="fw-bold">
        {mudando ? "Sim" : "Não"}
      </label>
      {datasExcluidas.length > 0 && !mudando && (
        <OverlayTrigger
          key={uuid()}
          trigger="click"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-datas-${uuid()}`}>
              <div className="overflow-auto" style={{ maxHeight: "250px" }}>
                {datasExcluidas.map((d) => (
                  <Col sm="12" key={uuid()}>
                    <span>{dataEmDma(amdEmData(d.data))}</span>
                  </Col>
                ))}
              </div>
            </Tooltip>
          }
        >
          <label role="button" className="ms-2 text-primary">
            Datas Excluidas
          </label>
        </OverlayTrigger>
      )}

      {salvando && <Spinner animation="grow" size="sm" className="ms-2" />}
      {mudando && (
        <Col sm="12">
          <Calendario
            altura={500}
            eventos={eventosFormatados}
            aoClicarData={aoClicarEmEvento}
          />
        </Col>
      )}
    </>
  );
}
