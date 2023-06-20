import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { gerarChaveUnica } from "../../utils";

export default function FormSelecao({
  titulo,
  textoReferencia,
  campoSelecao,
  textoVazio = "Nenhum registro encontrado",
  opcoesSelecao,
  textoBotao,
  opcoesDrop,
  aoEscolher,
  campoDrop,
  aoSelecionar,
}) {
  const [valor, setValor] = useState({});

  const aoMudar = (valor) => {
    if (valor.length < 1) {
      setValor({});
      return aoSelecionar ? aoSelecionar(valor[0]) : undefined;
    }
    setValor(valor[0]);
    if (aoSelecionar) aoSelecionar(valor[0]);
  };

  return (
    <form className="row w-100 pe-1 ps-1 mb-3 align-items-end">
      <div className="col-sm-3 p-0 m-0 pe-1">
        <label className="ms-2 text-nowrap">{titulo}</label>
        <Typeahead
          id={"typeahead" + titulo}
          placeholder={textoReferencia}
          labelKey={campoSelecao}
          emptyLabel={textoVazio}
          onChange={aoMudar}
          options={opcoesSelecao}
        />
      </div>
      <div className="col p-0 mt-1">
        <div className="dropdown">
          <button
            disabled={valor[campoSelecao] === undefined}
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {textoBotao}
          </button>
          <ul className="dropdown-menu p-0">
            {opcoesDrop.map((opcao) => (
              <li className="row h-100 w-100" key={gerarChaveUnica()}>
                <label
                  role="button"
                  className="col-12 align-middle h-100 ms-1 pt-1 pb-1"
                  onClick={() => aoEscolher({ valor, opcao })}
                >
                  {opcao[campoDrop]}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}
