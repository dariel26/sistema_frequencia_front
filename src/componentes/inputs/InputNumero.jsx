import { useState } from "react";

export default function InputNumero({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
  className,
  textoBotao = "Criar",
  numeroInicial = 0,
  numeroMax = 5,
  numeroMin = 1,
}) {
  const [valor, setValor] = useState(numeroInicial);

  const valorInvalido =
    valor === undefined || valor > numeroMax || valor < numeroMin;

  const aoEscrever = (e) => {
    e.preventDefault();
    const numero = e.target.value;
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
        type="number"
        max={numeroMax}
        min={numeroMin}
        placeholder={textoReferencia}
        value={valor}
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
