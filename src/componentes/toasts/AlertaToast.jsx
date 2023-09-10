import { useContext } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { SistemaContext } from "../../contexts";

function AlertaToast() {
  const { alertas } = useContext(SistemaContext);

  function estiloTexto(variante) {
    const estilo = "fw-bold";
    return estilo + (variante === "warning" ? " text-dark" : " text-light");
  }

  return (
    <ToastContainer className="position-fixed end-0 p-2 z-3">
      {alertas.map(({ texto, variante, id, deletar }) => (
        <Toast key={id} onClose={deletar} bg={variante}>
          <Toast.Header>
            <strong className="me-auto">Alerta</strong>
          </Toast.Header>
          <Toast.Body className={estiloTexto(variante)}>{texto}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default AlertaToast;
