import { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function InputHora({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
  className,
  textoBotao = "Criar",
  textoInicial = "",
}) {
  const [valor, setValor] = useState(textoInicial);
  const [salvando, setSalvando] = useState(false);

  const valorIncompleto = valor === undefined || valor.length < 5;

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let textoFormatado = texto.replace(/[^0-9]/g, "");

    if (textoFormatado.length >= 3) {
      const horas = textoFormatado.slice(0, 2);
      const minutos = textoFormatado.slice(2, 4);

      textoFormatado = `${horas}:${minutos}`;
    }
    if (textoFormatado.length === 1 && parseInt(textoFormatado) > 2) return;
    if (textoFormatado.length === 2 && parseInt(textoFormatado) > 23) return;
    if (textoFormatado.length === 4 && parseInt(textoFormatado[3]) > 5) return;
    setValor(textoFormatado);
  };

  const aoSubmeter = (e) => {
    if (valorIncompleto) return;
    e.preventDefault();
    setSalvando(true);
    aoClicar(valor).finally(() => {
      setSalvando(false);
    });
  };

  return (
    <div
      className={"input-group " + className}
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
        disabled={valorIncompleto}
        onClick={aoSubmeter}
      >
        {salvando ? (
          <Spinner size="sm" animation="grow" className="me-2" />
        ) : undefined}
        {textoBotao}
      </button>
    </div>
  );
}
