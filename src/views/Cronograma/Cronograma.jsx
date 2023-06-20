import CardDefault from "../../components/cards/CardDefault";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import brLocale from "@fullcalendar/core/locales/pt-br";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../filters/User";
import { useContext } from "react";
import { corClaraRandomica } from "../../utils";
import { BsFillCalendar2PlusFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import "./cronograma.css";

export default function Cronograma() {
  const [estagios, setEstagios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const usuario = useContext(UsuarioContext);

  useEffect(() => {
    const token = usuario.token;
    const p_estagios = apiSFE.listarEstagios(token);
    Promise.all([p_estagios]).then((res) => {
      const estagios = res[0].data;
      console.log(estagios);
      setEstagios(estagios);
    });
  }, [usuario]);

  const handleDateClick = (arg) => {
    console.log(arg.dateStr);
  };

  const abrirEdicao = (e) => {
    const editCronograma = document.getElementById("edit-cronograma");
    const editButton = document.getElementById("edit-button");
    if (modalAberto) {
      editCronograma.style.width = "0px";
      editCronograma.style.height = "0px";
      editButton.style.transform = "rotate(0deg)";
    } else {
      editCronograma.style.width = "100%";
      editCronograma.style.height = "100%";
      editButton.style.transform = "rotate(360deg)";
    }
    setModalAberto(!modalAberto);
  };

  return (
    <CardDefault title="Cronograma">
      <div className="h-100 position-relative">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            bootstrap5Plugin,
            timeGridPlugin,
          ]}
          dateClick={handleDateClick}
          height="100%"
          themeSystem="bootstrap5"
          locale={brLocale}
          headerToolbar={{
            start: "dayGridMonth,timeGridWeek,timeGridDay",
            center: "title",
            end: "today prev,next",
          }}
          initialView="dayGridMonth"
          selectable={true}
          events={[
            {
              allDay: true,
              start: new Date("06/02/2023"),
              end: new Date("06/21/2023"),
              display: "background",
              color: corClaraRandomica(),
            },
            {
              allDay: true,
              start: new Date("06/20/2023"),
              end: new Date("06/30/2023"),
              display: "background",
              color: corClaraRandomica(),
            },
          ]}
        />
        <div id="edit-cronograma" className="border rounded bg-white shadow-lg">
          <div className="row ps-2 pe-2"></div>
        </div>
        <button
          onClick={abrirEdicao}
          id="edit-button"
          className="position-fixed end-0 bottom-0 me-4 mb-4 btn btn-primary rounded-circle p-3 shadow"
        >
          {modalAberto ? (
            <GrClose size={24} />
          ) : (
            <BsFillCalendar2PlusFill size={24} />
          )}
        </button>
      </div>
    </CardDefault>
  );
}
