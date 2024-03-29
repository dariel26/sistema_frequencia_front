import { useEffect } from "react";
import { useCallback, useState } from "react";
import "./card.css";

export const idComponenteEscrol = "componente-scroll";

export default function CardRadios({ children, radios, newIndex }) {
  const [indexRadio, setIndexRadio] = useState(0);
  return (
    <div className="card w-100 rounded-0 border-0 h-100">
      <div className="card-header my-card-header overflow-auto">
        <div className="btn-group text-nowrap" role="group">
          {radios.map((r, index) => [
            <input
              key={"input" + r}
              type="radio"
              className="btn-check"
              id={"input" + r}
              checked={indexRadio === index}
              readOnly
            />,
            <label
              key={"label" + r}
              className="btn btn-outline-primary"
              htmlFor={"input" + r}
              onClick={() => {
                setIndexRadio(index);
                if (newIndex) newIndex(index);
              }}
            >
              {r}
            </label>,
          ])}
        </div>
      </div>
      <div className="card-body my-card-body">
        <div className="d-flex card-title align-items-between text-wrap border-bottom my-card-title">
          <h5 className="col-sm-5">
            {radios?.length > 0 ? radios[indexRadio] : undefined}
          </h5>
        </div>
        <div
          id={idComponenteEscrol}
          className="d-flex flex-column my-card-content"
        >
          {children}
          <div className="col-12 w-100 my-card-margin" />
        </div>
      </div>
    </div>
  );
}

export function CardRadiosBarraFixa(props) {
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
