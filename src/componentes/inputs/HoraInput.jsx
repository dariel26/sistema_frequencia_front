import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function HoraInput({
  texto,
  size,
  larguraMaxima,
  aoMudar,
}) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mudando, setMudando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;
  const inputRef = useRef();

  const valorIncompleto = valor === undefined || valor?.length < 5;

  useEffect(() => {
    setValor(texto ?? "");
  }, [texto]);

  const aoEscrever = (e) => {
    e.preventDefault();
    const texto = e.target.value;
    let textoFormatado = texto.replace(/[^0-9]/g, "");

    if (textoFormatado.length >= 3) {
      const horas = textoFormatado.slice(0, 2);
      const minutos = textoFormatado.slice(2, 4);

      textoFormatado = `${horas}:${minutos}`;
    }
    if (textoFormatado.length === 1 && parseInt(textoFormatado) > 2) return;
    if (textoFormatado.length === 2 && parseInt(textoFormatado) > 23) return;
    if (textoFormatado.length === 4 && parseInt(textoFormatado[3]) > 5) return;
    setValor(textoFormatado);
  };

  const aoSubmeter = (e) => {
    if (valorIncompleto) return;
    e.preventDefault();
    setSalvando(true);
    aoMudar(valor)
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
    }, 100);
  }

  return salvando ? (
    <Spinner animation="grow" size="sm" className="p-0" />
  ) : mudando ? (
    <InputGroup>
      <Form.Control
        ref={inputRef}
        onBlur={aoCancelar}
        size={size}
        placeholder={"00:00"}
        value={valor}
        onKeyUp={(e) => (e.key === "Enter" ? aoSubmeter(e) : undefined)}
        onChange={aoEscrever}
        style={{ maxWidth: `${larguraMaxima}px` }}
      />
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
      className={`${!texto && "text-danger"} fw-bold`}
      onClick={aoClicar}
    >
      {texto ?? "INDEFINDO"}
    </label>
  );
}
