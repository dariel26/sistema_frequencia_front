import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import brLocale from "@fullcalendar/core/locales/pt-br";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./calendario.css";

export default function Calendario({
  altura,
  trocarDiaSemanaMes,
  botaoHoje,
  larguraMaxima,
  eventos,
  aoClicarData,
}) {
  const aoClicar = (arg) => {
    if (aoClicarData) aoClicarData(arg);
  };

  return (
    <div style={{ height: `${altura}px`, maxWidth: `${larguraMaxima}px` }}>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
          timeGridPlugin,
        ]}
        dateClick={aoClicar}
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
