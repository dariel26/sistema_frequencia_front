import { useContext, useRef, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Spinner } from "react-bootstrap";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";
import "./input.css";

export default function TextoInput({
  texto,
  className,
  size,
  id,
  placeholder,
  labelKey,
  emptyLabel,
  aoMudar,
  opcoes,
}) {
  const [mudando, setMudando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);
  const inputRef = useRef();

  function aoClicar() {
    setMudando(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  }

  function aoCancelar() {
    setTimeout(() => {
      setMudando(false);
    }, 200);
  }

  function aoMudarInternamente(coordenadores) {
    setSalvando(true);
    aoMudar(coordenadores)
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => {
        setMudando(false);
        setSalvando(false);
      });
  }

  return salvando ? (
    <Spinner animation="grow" size="sm" className="p-0" />
  ) : mudando ? (
    <Typeahead
      ref={inputRef}
      onBlur={aoCancelar}
      className={"texto-input " + className}
      size={size}
      id={id}
      defaultInputValue={texto ?? ""}
      placeholder={placeholder}
      labelKey={labelKey}
      emptyLabel={emptyLabel}
      onChange={aoMudarInternamente}
      options={opcoes}
    />
  ) : (
    <label
      role="button"
      className={`${!texto && "text-danger"} fw-bold`}
      onClick={aoClicar}
    >
      {texto ?? "INDEFINDO"}
    </label>
  );
}
