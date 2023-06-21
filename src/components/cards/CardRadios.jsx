import { useState } from "react";

export const idComponenteEscrol = "componente-scroll";

export default function CardRadios({ children, radios, newIndex }) {
  const [indexRadio, setIndexRadio] = useState(0);
  return (
    <div className="card w-100 rounded-0 border-0 h-100">
      <div className="card-header overflow-auto" style={{ height: "55px" }}>
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
      <div className="card-body" style={{ height: "calc(100% - 55px)" }}>
        <div
          className="d-flex card-title align-items-between text-wrap border-bottom"
          style={{ height: "40px" }}
        >
          <h5 className="col-sm-5">
            {radios?.length > 0 ? radios[indexRadio] : undefined}
          </h5>
        </div>
        <div
          id={idComponenteEscrol}
          className="d-flex"
          style={{ height: "calc(100% - 40px)", overflowY: "auto" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
