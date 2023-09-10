import { useContext, useState } from "react";
import { Spinner } from "react-bootstrap";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

export default function BotaoTexto({
  className,
  aoClicar,
  texto,
  visivel,
  assincrono,
}) {
  const [salvando, setSalvando] = useState(false);

  const { error, sucesso } = useContext(SistemaContext);

  const aoSubmeter = (e) => {
    e.preventDefault();
    if (assincrono) {
      setSalvando(true);
      aoClicar()
        .then((msg) => msg && sucesso(msg))
        .catch((err) => error(errors.filtraMensagem(err)))
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
