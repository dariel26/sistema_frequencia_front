import Modal from "react-bootstrap/Modal";

function ModalCarregando({ show }) {
  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} className="z-n">
        <Modal.Header>
          <Modal.Title>Carregando...</Modal.Title>
        </Modal.Header>
        <Modal.Body>Aguarde enquanto os dados são buscados.</Modal.Body>
      </Modal>
    </>
  );
}

export default ModalCarregando;
