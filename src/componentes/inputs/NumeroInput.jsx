import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";
import "./input.css";

export default function NumeroInput({
  aoMudar,
  texto = "",
  valorReal = "",
  maximoValor = 10,
  minimoValor = 1,
  size,
  assincrono = true,
  sinalizarErro = false,
}) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mudando, setMudando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);
  const inputRef = useRef();

  const valorInvalido =
    isNaN(parseInt(valor)) ||
    parseInt(valor) < minimoValor ||
    parseInt(valor) > maximoValor;

  useEffect(() => {
    setValor(valorReal ?? "");
  }, [valorReal]);

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let numero = texto.replace(/[^0-9]/g, "");
    setValor(numero);
  };

  const aoSubmeter = (e) => {
    if (valorInvalido) return;
    e.preventDefault();
    if (!assincrono) {
      setMudando(false);
      return aoMudar(parseInt(valor));
    }
    setSalvando(true);
    aoMudar(parseInt(valor))
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
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
        className="numero-input"
        isInvalid={valorInvalido}
        ref={inputRef}
        onBlur={aoCancelar}
        size={size}
        value={valor ?? ""}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
      />
      <Form.Control.Feedback tooltip type="invalid">
        {valorInvalido &&
          `O número deve estar entre ${minimoValor} e ${maximoValor}`}
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
      className={`${(!texto || sinalizarErro) && "text-danger"} fw-bold`}
      onClick={aoClicar}
    >
      {texto ?? "INDEFINDO"}
    </label>
  );
}
