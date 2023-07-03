import { useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
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
  const [salvando, setSalvando] = useState(false);

  const valorVazio = valor[campoSelecao] === undefined;
  const aoMudar = (valor) => {
    if (valor.length < 1) {
      setValor({});
      return aoSelecionar ? aoSelecionar(valor[0]) : undefined;
    }
    setValor(valor[0]);
    if (aoSelecionar) aoSelecionar(valor[0]);
  };

  const aoClicar = (e, opcao) => {
    e.preventDefault();
    setSalvando(true);
    aoEscolher({ valor, opcao }).finally(() => setSalvando(false));
  };

  return (
    <form className="row w-100 align-items-end">
      <div className="col pe-0">
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
      <div className="col mt-1">
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            disabled={valorVazio || salvando}
          >
            {salvando ? (
              <Spinner animation="grow" size="sm" className="me-2" />
            ) : undefined}
            {textoBotao}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {opcoesDrop.map((opcao) => (
              <Dropdown.Item
                key={gerarChaveUnica()}
                as="button"
                onClick={(e) => aoClicar(e, opcao)}
              >
                {opcao[campoDrop]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </form>
  );
}
