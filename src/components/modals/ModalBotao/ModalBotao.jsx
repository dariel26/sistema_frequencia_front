import { useState } from "react";
import { GrClose } from "react-icons/gr";
import "./modalBotao.css";

export default function ModalBotao(props) {
  const [modalAberto, setModalAberto] = useState(false);

  const aoClicar = (e) => {
    e.preventDefault();
    setModalAberto(!modalAberto);
  };

  return (
    <div
      className={`modal-vazio border rounded bg-white shadow-lg ${
        modalAberto ? "aberto" : ""
      }`}
      onAnimationStart={() => console.log("entrou")}
    >
      <div className="modal-conteudo">{props.children}</div>
      <button
        onClick={aoClicar}
        className="modal-vazio-botao position-fixed end-0 bottom-0 me-4 mb-4 btn btn-primary p-3 shadow"
      >
        {modalAberto ? <GrClose size={24} /> : props.conteudoBotao}
      </button>
    </div>
  );
}
