import { useContext, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

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

  const { sucesso, error } = useContext(SistemaContext);

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
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setSalvado(false));
  };

  function aoFocar(e) {
    setTimeout(() => {
      e.target?.setSelectionRange(0, e.target.value?.length);
    }, 200);
  }

  return (
    <Form className="row align-items-end me-0">
      <InputGroup size="sm" className="z-0">
        <Typeahead
          id="typeahead"
          onFocus={aoFocar}
          placeholder={textoReferencia}
          labelKey={campoSelecao}
          emptyLabel={textoVazio}
          onChange={aoMudar}
          options={opcoesSelecao}
          defaultInputValue={textoInicial ?? ""}
        />
        <Button
          disabled={valor[campoSelecao] === undefined || salvando}
          onClick={aoClicar}
        >
          {salvando ? (
            <Spinner animation="grow" size="sm" className="me-2" />
          ) : undefined}
          {textoBotao}
        </Button>
      </InputGroup>
    </Form>
  );
}
