import { useContext, useState } from "react";
import { Spinner } from "react-bootstrap";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

export default function DivCabecalhoDeletar({
  titulo,
  aoDeletar,
  textoBotao,
  children,
  className,
}) {
  const [salvando, setSalvando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);

  const aoClicar = () => {
    if (salvando) return;
    setSalvando(true);
    aoDeletar()
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => {
        setSalvando(false);
      });
  };

  return (
    <div className={className ?? "border-bottom border-4 border-primary"}>
      <div className="d-flex align-items-center justify-content-between">
        <span className="fs-5 fw-bold">{titulo}</span>
        <label role="button" className="text-primary" onClick={aoClicar}>
          {salvando ? (
            <Spinner size="sm" animation="grow" className="me-2" />
          ) : undefined}
          {textoBotao}
        </label>
      </div>
      {children}
    </div>
  );
}
