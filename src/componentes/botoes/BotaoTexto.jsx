import { useContext, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function BotaoTexto({
  className,
  aoClicar,
  texto,
  visivel,
  assincrono,
}) {
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const aoSubmeter = (e) => {
    e.preventDefault();
    if (assincrono) {
      setSalvando(true);
      aoClicar()
        .then(
          (strSucesso) =>
            strSucesso && alerta.adicionaAlerta(undefined, strSucesso)
        )
        .catch((err) => alerta.adicionaAlerta(err))
        .finally(() => setSalvando(false));
    } else {
      aoClicar();
    }
  };

  return (
    visivel && (
      <label
        role="button"
        className={"text-primary " + className}
        onClick={aoSubmeter}
      >
        {salvando ? (
          <Spinner size="sm" animation="grow" className="me-2" />
        ) : undefined}
        {texto}
      </label>
    )
  );
}
