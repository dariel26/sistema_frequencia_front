import { useState } from "react";

export default function InputNumero({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
  className,
  textoBotao = "Criar",
  numeroMax = 5,
  numeroMin = 1,
  textoInicial = "",
}) {
  const [valor, setValor] = useState(textoInicial ?? "");

  const valorInvalido =
    isNaN(parseInt(valor)) || valor > numeroMax || valor < numeroMin;

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let numero = texto.replace(/[^0-9]/g, "");
    setValor(numero);
  };

  const aoSubmeter = (e) => {
    if (valorInvalido) return;
    e.preventDefault();
    aoClicar(valor);
  };

  return (
    <div
      className={"input-group " + className}
      style={{ height: `${altura}px`, maxWidth: `${maximaLargura}px` }}
    >
      <input
        className="form-control"
        placeholder={textoReferencia}
        value={valor??""}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
      />
      <button
        className="btn btn-primary"
        disabled={valorInvalido}
        onClick={aoSubmeter}
      >
        {textoBotao}
      </button>
    </div>
  );
}
