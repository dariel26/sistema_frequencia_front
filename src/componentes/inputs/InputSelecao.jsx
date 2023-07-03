import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

export default function InputSelecao({
  textoReferencia,
  campoSelecao,
  textoVazio = "Nenhum registro encontrado",
  opcoesSelecao,
  textoBotao,
  aoSubmeter,
  larguraMaxima,
  textoInicial = "",
}) {
  const [valor, setValor] = useState({});
  const [salvando, setSalvado] = useState(false);

  const aoMudar = (valor) => {
    if (valor.length < 1) {
      return setValor({});
    }
    setValor(valor[0]);
  };

  const aoClicar = (e) => {
    e.preventDefault();
    setSalvado(true);
    aoSubmeter(valor).finally(() => setSalvado(false));
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
          defaultInputValue={textoInicial}
        />
      </div>
      <div className="col mt-1">
        <button
          disabled={valor[campoSelecao] === undefined || salvando}
          className="btn btn-secondary"
          onClick={aoClicar}
        >
          {salvando ? (
            <Spinner animation="grow" size="sm" className="me-2" />
          ) : undefined}
          {textoBotao}
        </button>
      </div>
    </form>
  );
}
