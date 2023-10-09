import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConcorda({ show, mensagem, resAviso }) {
  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} className="z-n">
        <Modal.Header>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensagem}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => resAviso(true)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConcorda;
