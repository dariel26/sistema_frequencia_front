import { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function BotaoTexto({
  className,
  aoClicar,
  texto,
  visivel,
  assincrono,
}) {
  const [salvando, setSalvando] = useState(false);

  const aoSubmeter = (e) => {
    e.preventDefault();
    if (assincrono) {
      setSalvando(true);
      aoClicar().finally(() => setSalvando(false));
    } else {
      aoClicar();
    }
  };

  return visivel ? (
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
  ) : undefined;
}
