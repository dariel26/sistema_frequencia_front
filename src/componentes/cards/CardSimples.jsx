import { useCallback, useEffect } from "react";
import { Card } from "react-bootstrap";
import "./card.css";

const idComponenteEscrol = "id-simples-escrol";

export default function CardSimples({ children, titulo, tituloCentralizado }) {
  return (
    <div className="card w-100 h-100 rounded-0 border-0">
      <div
        className={`card-header my-card-header ${
          tituloCentralizado ? "" : "text-start"
        } d-flex align-items-center`}
      >
        <h4 className="col mb-0">{titulo}</h4>
      </div>
      <Card.Body className="my-card-body">
        <div
          id={idComponenteEscrol}
          className="d-flex flex-column h-100 my-overflow-y"
        >
          {children}
          <div className="col-12 w-100 my-card-margin" />
        </div>
      </Card.Body>
    </div>
  );
}

export function CardSimplesBarraFixa(props) {
  const aoEscrolar = useCallback(() => {
    const componenteEscrol = document.getElementById(idComponenteEscrol);
    const componente = document.getElementById("barra-fixa");
    const posicaoEscrol = componenteEscrol.scrollTop;
    if (posicaoEscrol > 0) {
      componente.classList.add("shadow-sm");
    } else {
      componente.classList.remove("shadow-sm");
    }
  }, []);

  useEffect(() => {
    const componenteEscrol = document.getElementById(idComponenteEscrol);
    componenteEscrol.addEventListener("scroll", aoEscrolar, false);
    return () => {
      componenteEscrol.removeEventListener("scroll", aoEscrolar, false);
    };
  }, [aoEscrolar]);

  return (
    <div id="barra-fixa" className="col-12 position-sticky top-0 bg-white z-1">
      {props.children}
    </div>
  );
}
