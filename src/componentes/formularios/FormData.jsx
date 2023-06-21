import { useState } from "react";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";

export default function FormData({ titulo, aoSelecionarDatas, textoBotao }) {
  const [dataEscolhida, setDataEscolhida] = useState({
    data_inicial: null,
    data_final: null,
  });

  const aoMudarAData = (intervalo) => {
    setDataEscolhida({ data_inicial: intervalo[0], data_final: intervalo[1] });
  };

  const aoEscolherDatas = (e) => {
    e.preventDefault();
    aoSelecionarDatas(dataEscolhida);
  };
  return (
    <form className="row w-100 align-items-end">
      <div className="col mb-1 pe-0">
        <label className="ms-2 text-nowrap">{titulo}</label>
        <DatePicker
          className="form-control"
          locale={ptBR}
          dateFormat="dd/MM/yyyy"
          onChange={(intervalo) => aoMudarAData(intervalo)}
          startDate={dataEscolhida.data_inicial}
          endDate={dataEscolhida.data_final}
          selectsRange
        />
      </div>
      <div className="col mb-1">
        <button
          disabled={
            dataEscolhida.data_inicial === null ||
            dataEscolhida.data_final === null
          }
          className="btn border-primary text-primary"
          onClick={aoEscolherDatas}
        >
          {textoBotao}
        </button>
      </div>
    </form>
  );
}
