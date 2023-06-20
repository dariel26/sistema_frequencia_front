import { useState } from "react";

export default function InputBotao({
  textoReferencia,
  aoClicar,
  altura,
  maximaLargura,
}) {
  const [valor, setValor] = useState("");

  const valorVazio = valor === "" || valor === undefined;

  const aoEscrever = (e) => {
    e.preventDefault();
    setValor(String(e.target.value));
  };

  const aoSubmeter = (e) => {
    if (valorVazio) return;
    e.preventDefault();
    aoClicar(valor);
    setValor("");
  };

  return (
    <div
      className="input-group m-2"
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
        disabled={valorVazio}
        onClick={aoSubmeter}
      >
        Criar
      </button>
    </div>
  );
}
