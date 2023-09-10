import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import brLocale from "@fullcalendar/core/locales/pt-br";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./cronograma.css";
import { CardSimples } from "../../componentes";
import { CloseButton, Col, Overlay, Popover, Row } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import apiSFE from "../../service/api";
import { UsuarioContext } from "../../contexts/usuario/Usuario";
import { amdEmData, errors, horarioEmData } from "../../utils";
import obterCor from "../../utils/cores";
import uuid from "react-uuid";
import { SistemaContext } from "../../contexts/sistema/Sistema";

export default function Cronograma() {
  const [eventos, setEventos] = useState([]);
  const [mostrarPop, setMostrarPop] = useState(false);
  const [target, setTarget] = useState(null);
  const [indexDataAtividade, setIndexDataAtividade] = useState(null);
  const [datasAtividades, setDatasAtividades] = useState([]);
  const ref = useRef(null);

  const { token } = useContext(UsuarioContext);
  const { error } = useRef(useContext(SistemaContext)).current;
  const { carregando } = useRef(useContext(SistemaContext)).current;

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarAtividades(token)
      .then((res) => {
        const atividades = res.data;
        const eventos = atividades.flatMap((a, i) => {
          return a.datas.map((d) => ({
            title: a.nome_atividade,
            id: d.id_dataatividade,
            groupId: a.id_estagio,
            start: horarioEmData(amdEmData(d.data), a.hora_inicial),
            end: horarioEmData(amdEmData(d.data), a.hora_final),
            backgroundColor: obterCor(i),
            borderColor: obterCor(i),
          }));
        });
        setDatasAtividades(atividades.flatMap((a) => a.datas));
        setEventos(eventos);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [error, token, carregando]);

  function aoClicarEmEvento(info) {
    setMostrarPop(true);
    const index = datasAtividades.findIndex(
      (d) =>
        d.id_dataatividade === parseInt(info.el.fcSeg.eventRange.def.publicId)
    );
    setIndexDataAtividade(index);
    setTarget(info.jsEvent.target);
  }

  return (
    <CardSimples titulo="Cronograma">
      <Row className="justify-content-center m-0">
        <Col sm="12">
          <div className="cronograma" ref={ref}>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                bootstrap5Plugin,
                timeGridPlugin,
              ]}
              eventClick={aoClicarEmEvento}
              height="100%"
              themeSystem="bootstrap5"
              locale={brLocale}
              headerToolbar={{
                start: "dayGridMonth,timeGridWeek,timeGridDay",
                center: "title",
                end: "today prev,next",
              }}
              initialView="dayGridMonth"
              events={eventos}
              stickyHeaderDates={true}
            />
          </div>
        </Col>
      </Row>
      <Overlay
        show={mostrarPop}
        target={target}
        placement="bottom"
        flip
        container={ref}
        containerPadding={20}
      >
        <Popover className="shadow">
          <Popover.Header as="h3" className="p-0">
            <label className="p-2"> Alunos deste horário</label>
            <CloseButton
              className="ms-2 float-end m-1"
              onClick={() => setMostrarPop(false)}
            />
          </Popover.Header>
          <Popover.Body>
            {indexDataAtividade !== null &&
            datasAtividades[indexDataAtividade].alunos.length > 0 ? (
              datasAtividades[indexDataAtividade].alunos.map((a) => (
                <Col>
                  <span key={uuid()}>{a.nome}</span>
                </Col>
              ))
            ) : (
              <span> -- Nenhum aluno -- </span>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </CardSimples>
  );
}
