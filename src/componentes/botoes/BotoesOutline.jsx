import { useContext, useRef, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function BotaoOutline({
  variant,
  disable,
  aoClicar,
  textoBotao,
}) {
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  function aoClicarInternamente() {
    setSalvando(true);
    aoClicar()
      .then(
        (strSucesso) =>
          strSucesso && alerta.adicionaAlerta(undefined, strSucesso)
      )
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvando(false));
  }

  return (
    <Button
      variant={`outline-${variant}`}
      disabled={salvando || disable}
      onClick={aoClicarInternamente}
    >
      {salvando ? (
        <Spinner size="sm" animation="grow" className="me-2" />
      ) : undefined}
      {textoBotao}
    </Button>
  );
}
