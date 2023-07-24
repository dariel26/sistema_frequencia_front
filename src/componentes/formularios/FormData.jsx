import { useContext, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function FormData({
  titulo,
  aoSelecionarDatas,
  textoBotao,
  assincrono,
}) {
  const [dataEscolhida, setDataEscolhida] = useState({
    data_inicial: null,
    data_final: null,
  });
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const intervaloInvalido =
    dataEscolhida.data_inicial === null || dataEscolhida.data_final === null;

  const aoMudarAData = (intervalo) => {
    setDataEscolhida({ data_inicial: intervalo[0], data_final: intervalo[1] });
  };

  const aoEscolherDatas = (e) => {
    e.preventDefault();
    if (!assincrono) return aoSelecionarDatas(dataEscolhida);
    setSalvando(true);
    aoSelecionarDatas(dataEscolhida)
      .then(
        (strSucesso) =>
          strSucesso && alerta.adicionaAlerta(undefined, strSucesso)
      )
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvando(false));
  };
  return (
    <>
      <Form.Label className="ms-2 text-nowrap">{titulo}</Form.Label>
      <InputGroup>
        <DatePicker
          className="form-control rounded-end-0"
          locale={ptBR}
          dateFormat="dd/MM/yyyy"
          onChange={(intervalo) => aoMudarAData(intervalo)}
          startDate={dataEscolhida.data_inicial}
          endDate={dataEscolhida.data_final}
          selectsRange
        />
        <Button disabled={intervaloInvalido || salvando} onClick={aoEscolherDatas}>
          {salvando && <Spinner animation="grow" size="sm" className="me-2" />}
          {textoBotao}
        </Button>
      </InputGroup>
    </>
  );
}
