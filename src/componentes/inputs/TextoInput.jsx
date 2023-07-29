import { useContext, useRef, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { AlertaContext } from "../../filters/alerta/Alerta";
import { Spinner } from "react-bootstrap";

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
  larguraMaxima,
}) {
  const [mudando, setMudando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const inputRef = useRef();
  const alerta = useRef(useContext(AlertaContext)).current;

  function aoClicar() {
    setMudando(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  }

  function aoCancelar() {
    setTimeout(() => {
      setMudando(false);
    }, 100);
  }

  function aoMudarInternamente(coordenadores) {
    setSalvando(true);
    aoMudar(coordenadores)
      .then((strSucesso) => {
        strSucesso && alerta.adicionaAlerta(undefined, strSucesso);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      })
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
      style={{ maxWidth: `${larguraMaxima}px` }}
      className={className}
      size={size}
      id={id}
      defaultInputValue={texto??""}
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
