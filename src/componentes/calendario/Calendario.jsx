import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import brLocale from "@fullcalendar/core/locales/pt-br";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./calendario.css";
import { useContext, useState } from "react";
import { dataEmAmd, errors } from "../../utils";
import { SistemaContext } from "../../contexts";
import { Spinner } from "react-bootstrap";

export default function Calendario({
  altura,
  trocarDiaSemanaMes,
  botaoHoje,
  larguraMaxima,
  eventos,
  aoClicarData,
  dataInicial,
  callendarRef,
}) {
  const { sucesso, error } = useContext(SistemaContext);

  const [salvando, setSalvando] = useState(false);

  function aoClicarEmEvento({ date }) {
    if (salvando) return;

    const eventoClicado = eventos.find(
      ({ start }) => dataEmAmd(start) === dataEmAmd(date)
    );

    if (eventoClicado === undefined) return;

    setSalvando(true);
    aoClicarData(eventoClicado)
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setSalvando(false));
  }

  return (
    <div className="mb-4 my-calendario w-100">
      <Spinner
        size="sm"
        variant="primary"
        animation="grow"
        className={salvando ? "opacity-1" : "opacity-0"}
      />
      <FullCalendar
        ref={callendarRef}
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
          timeGridPlugin,
        ]}
        dateClick={aoClicarEmEvento}
        height="100%"
        themeSystem="bootstrap5"
        locale={brLocale}
        headerToolbar={{
          start: trocarDiaSemanaMes
            ? "dayGridMonth,timeGridWeek,timeGridDay"
            : "",
          center: "title",
          end: botaoHoje ? "today prev,next" : "prev,next",
        }}
        initialView="dayGridMonth"
        initialDate={dataInicial}
        titleFormat={
          trocarDiaSemanaMes
            ? { year: "numeric", month: "short", day: "numeric" }
            : { year: "numeric", month: "short" }
        }
        selectable={true}
        events={eventos}
      />
    </div>
  );
}
