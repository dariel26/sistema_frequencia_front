import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

export default function InputSelecao({
  textoReferencia,
  campoSelecao,
  textoVazio = "Nenhum registro encontrado",
  opcoesSelecao,
  textoBotao,
  aoSubmeter,
  larguraMaxima,
}) {
  const [valor, setValor] = useState({});

  const aoMudar = (valor) => {
    if (valor.length < 1) {
      return setValor({});
    }
    setValor(valor[0]);
  };

  const aoClicar = (e) => {
    e.preventDefault();
    if (valor[campoSelecao] === undefined) return;
    aoSubmeter(valor);
  };

  return (
    <form
      className="row w-100 align-items-end"
      style={{ maxWidth: `${larguraMaxima}px` }}
    >
      <div className="col pe-0">
        <Typeahead
          id="typeahead"
          placeholder={textoReferencia}
          labelKey={campoSelecao}
          emptyLabel={textoVazio}
          onChange={aoMudar}
          options={opcoesSelecao}
        />
      </div>
      <div className="col mt-1">
        <button
          disabled={valor[campoSelecao] === undefined}
          className="btn btn-secondary"
          onClick={aoClicar}
        >
          {textoBotao}
        </button>
      </div>
    </form>
  );
}
