import { useContext, useRef, useState } from "react";
import { InputGroup, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { AlertaContext } from "../../filters/alerta/Alerta";

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

  const alerta = useRef(useContext(AlertaContext)).current;

  const aoMudar = (valor) => {
    if (valor.length < 1) {
      return setValor({});
    }
    setValor(valor[0]);
  };

  const aoClicar = (e) => {
    e.preventDefault();
    setSalvado(true);
    aoSubmeter(valor)
      .then((strSucesso) => alerta.adicionaAlerta(undefined, strSucesso))
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvado(false));
  };

  return (
    <form
      className="row w-100 align-items-end"
      style={{ maxWidth: `${larguraMaxima}px` }}
    >
      <InputGroup size="sm">
        <Typeahead
          id="typeahead"
          placeholder={textoReferencia}
          labelKey={campoSelecao}
          emptyLabel={textoVazio}
          onChange={aoMudar}
          options={opcoesSelecao}
          defaultInputValue={textoInicial ?? ""}
        />
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
      </InputGroup>
    </form>
  );
}
