import { useState } from "react";

export default function InputIntervalo({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
  className,
  textoBotao = "Criar",
  textoInicial = "",
  maximoValor = 10,
}) {
  const [valor, setValor] = useState(textoInicial);

  const valorInicial = parseInt(valor.split("-")[0] ?? 0);
  const valorFinal = parseInt(valor.split("-")[1] ?? 0);
  const valorInicialInvalido = valorInicial >= valorFinal || valorInicial === 0;
  const valorFinalInvalido = valorFinal === 0 || valorFinal > maximoValor;

  const valorIncompleto =
    !/^\d+-\d+$/.test(valor) || valorInicialInvalido || valorFinalInvalido;

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let textoFormatado = texto.replace(/[^0-9-]/g, "");
    setValor(textoFormatado);
  }

  const aoSubmeter = (e) => {
    if (valorIncompleto) return;
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
        value={valor}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
      />
      <button
        className="btn btn-primary"
        disabled={valorIncompleto}
        onClick={aoSubmeter}
      >
        {textoBotao}
      </button>
    </div>
  );
}
