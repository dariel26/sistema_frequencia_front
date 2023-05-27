import { useState } from "react";

export default function CardRadios({ children, radios, newIndex }) {
  const [indexRadio, setIndexRadio] = useState(0);
  return (
    <div className="card w-100">
      <div className="card-header">
        <div className="btn-group" role="group">
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
      <div className="card-body">
        <div className="d-flex gap-1 card-title align-items-between text-wrap">
          <h5 className="col-sm-5">
            {radios?.length > 0 ? radios[indexRadio] : undefined}
          </h5>
        </div>
        <hr />
        {children}
      </div>
    </div>
  );
}
