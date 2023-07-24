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
}) {
  const [mudando, setMudando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  function aoClicar() {
    setMudando(true);
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
        setSalvando(false);
      });
  }

  return salvando ? (
    <Spinner animation="grow" size="sm" />
  ) : mudando ? (
    <Typeahead
      className={className}
      size={size}
      id={id}
      placeholder={placeholder}
      labelKey={labelKey}
      emptyLabel={emptyLabel}
      onChange={aoMudarInternamente}
      options={opcoes}
    />
  ) : (
    <label
      role="button"
      className={`${!texto && "text-danger"}`}
      onClick={aoClicar}
    >
      {texto ?? "INDEFINDO"}
    </label>
  );
}
