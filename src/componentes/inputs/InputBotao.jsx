import { useContext, useState } from "react";
import { Spinner } from "react-bootstrap"; //TODO componentizar
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

export default function InputBotao({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
  className,
  textoInicial = "",
}) {
  const [valor, setValor] = useState(textoInicial);
  const [salvando, setSalvando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);

  const valorVazio = valor === "" || valor === undefined;

  const aoEscrever = (e) => {
    e.preventDefault();
    setValor(String(e.target.value));
  };

  const aoSubmeter = (e) => {
    e.preventDefault();
    if (valorVazio) return;

    setSalvando(true);
    aoClicar(valor)
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setSalvando(false));
    setValor("");
  };

  return (
    <div
      className={"input-group z-0 " + className}
      style={{ height: `${altura}px`, maxWidth: `${maximaLargura}px` }}
    >
      <input
        className="form-control"
        placeholder={textoReferencia}
        value={valor ?? ""}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
      />
      <button
        className="btn btn-primary"
        disabled={valorVazio}
        onClick={aoSubmeter}
      >
        {salvando && <Spinner animation="grow" size="sm" className="me-2" />}
        Criar
      </button>
    </div>
  );
}
