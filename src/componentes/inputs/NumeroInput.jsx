import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function NumeroInput({
  aoMudar,
  texto = "",
  maximoValor = 10,
  size,
  larguraMaxima,
}) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mudando, setMudando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;
  const inputRef = useRef();

  const valorInvalido =
    isNaN(parseInt(valor)) ||
    parseInt(valor) <= 0 ||
    parseInt(valor) > maximoValor;

  useEffect(() => {
    setValor(texto ?? "");
  }, [texto]);

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let numero = texto.replace(/[^0-9]/g, "");
    setValor(numero);
  };

  const aoSubmeter = (e) => {
    if (valorInvalido) return;
    e.preventDefault();
    setSalvando(true);
    aoMudar(parseInt(valor))
      .then(
        (strSucesso) =>
          strSucesso && alerta.adicionaAlerta(undefined, strSucesso)
      )
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => {
        setSalvando(false);
        setMudando(false);
      });
  };

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

  return salvando ? (
    <Spinner animation="grow" size="sm" className="p-0" />
  ) : mudando ? (
    <InputGroup hasValidation>
      <Form.Control
        isInvalid={valorInvalido}
        ref={inputRef}
        onBlur={aoCancelar}
        size={size}
        value={valor??""}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
        style={{ maxWidth: `${larguraMaxima}px` }}
      />
      <Form.Control.Feedback tooltip type="invalid">
        {valorInvalido &&
          `O número deve ser maior que 0 e menor ou igual a ${maximoValor}`}
      </Form.Control.Feedback>
      <Button
        onClick={aoSubmeter}
        size={size}
        disabled={salvando || valorInvalido}
      >
        Salvar
      </Button>
    </InputGroup>
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
