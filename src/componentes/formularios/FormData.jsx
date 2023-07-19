import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Button, Form, InputGroup } from "react-bootstrap";

export default function FormData({ titulo, aoSelecionarDatas, textoBotao }) {
  const [dataEscolhida, setDataEscolhida] = useState({
    data_inicial: null,
    data_final: null,
  });

  const intervaloInvalido =
    dataEscolhida.data_inicial === null || dataEscolhida.data_final === null;

  const aoMudarAData = (intervalo) => {
    setDataEscolhida({ data_inicial: intervalo[0], data_final: intervalo[1] });
  };

  const aoEscolherDatas = (e) => {
    e.preventDefault();
    aoSelecionarDatas(dataEscolhida);
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
        <Button disabled={intervaloInvalido} onClick={aoEscolherDatas}>
          {textoBotao}
        </Button>
      </InputGroup>
    </>
  );
}
