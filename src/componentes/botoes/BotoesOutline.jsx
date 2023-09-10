import { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

export default function BotaoOutline({
  variant,
  disable,
  aoClicar,
  textoBotao,
}) {
  const [salvando, setSalvando] = useState(false);

  const { error, sucesso } = useContext(SistemaContext);

  function aoClicarInternamente() {
    setSalvando(true);
    aoClicar()
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
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
