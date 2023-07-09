import { useEffect } from "react";
import { useCallback } from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import uuid from "react-uuid";

export const idComponenteEscrol = "componente-scroll";

export default function CardLinks({ children, navs }) {
  return (
    <Card className="rounded-0 border-0 w-100 h-100">
      <Card.Header
        className="text-nowrap overflow-auto p-2 d-flex align-items-center"
        style={{ height: "57px" }}
      >
        {navs.map(({ valor, texto }) => (
          <NavLink
            to={valor}
            className="text-decoration-none d-flex h-100 align-items-center"
            key={uuid()}
          >
            {({ isActive }) => (
              <span
                className={`rounded me-2 p-2 align-items-center ${
                  isActive && "bg-primary text-white"
                }`}
              >
                {texto}
              </span>
            )}
          </NavLink>
        ))}
      </Card.Header>
      <Card.Body style={{ height: "calc(100% - 57px)" }}>
        <div
          id={idComponenteEscrol}
          className="d-flex flex-column h-100"
          style={{ overflowY: "auto" }}
        >
          {children}
          <div className="col-12 w-100" style={{ height: "300px" }} />
        </div>
      </Card.Body>
    </Card>
  );
}

export function CardLinksBarraFixa(props) {
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
