import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConfirma({ show, mensagem, resAviso }) {
  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} className="z-n">
        <Modal.Header closeButton>
          <Modal.Title>Deseja continuar?</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensagem}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => resAviso(false)}>
            Cancelar
          </Button>
          <Button variant="outline-secondary" onClick={() => resAviso(true)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirma;
