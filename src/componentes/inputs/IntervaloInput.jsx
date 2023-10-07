import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { errors } from "../../utils";
import { SistemaContext } from "../../contexts";
import "./input.css";

export default function IntervaloInput({
  aoMudar,
  texto = "",
  valorReal = "",
  maximoValor = 10,
  size,
  larguraMaxima,
  assincrono = true,
  sinalizaErro = false,
}) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mudando, setMudando] = useState(false);

  const { sucesso, error } = useContext(SistemaContext);
  const inputRef = useRef();

  const valorInicial = parseInt(valor?.split("-")[0] ?? 0);
  const valorFinal = parseInt(valor?.split("-")[1] ?? 0);
  const valorInicialInvalido =
    valorInicial > valorFinal || valorInicial === 0 || isNaN(valorInicial);
  const valorFinalInvalido =
    valorFinal === 0 || valorFinal > maximoValor || isNaN(valorFinal);

  const valorIncompleto =
    !/^\d+-\d+$/.test(valor) || valorInicialInvalido || valorFinalInvalido;

  useEffect(() => {
    setValor(valorReal ?? "");
  }, [valorReal]);

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let textoFormatado = texto.replace(/[^0-9-]/g, "");
    setValor(textoFormatado);
  };

  const aoSubmeter = (e) => {
    if (valorIncompleto) return;
    e.preventDefault();
    if (!assincrono) {
      setMudando(false);
      return aoMudar(valor);
    }
    setSalvando(true);
    aoMudar(valor)
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
    <Spinner animation="grow" size="sm" className="p-0" variant="primary" />
  ) : mudando ? (
    <InputGroup hasValidation>
      <Form.Control
        className="intervalo-input"
        isInvalid={valorIncompleto}
        ref={inputRef}
        onBlur={aoCancelar}
        size={size}
        placeholder={"1-5"}
        value={valor ?? ""}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
      />
      <Form.Control.Feedback tooltip type="invalid">
        {valorIncompleto ? `Os limites são: 1-${maximoValor}` : ""}
      </Form.Control.Feedback>
      <Button
        onClick={aoSubmeter}
        size={size}
        disabled={salvando || valorIncompleto}
      >
        Salvar
      </Button>
    </InputGroup>
  ) : (
    <label
      role="button"
      className={`${!texto || (sinalizaErro && "text-danger")} fw-bold`}
      onClick={aoClicar}
    >
      {texto ?? "INDEFINDO"}
    </label>
  );
}
