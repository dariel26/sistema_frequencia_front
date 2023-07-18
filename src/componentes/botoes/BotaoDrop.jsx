import { useContext, useRef, useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { gerarChaveUnica } from "../../utils";
import { AlertaContext } from "../../filters/alerta/Alerta";

export default function BotaoDrop({ textoBotao, dadosMenu, desabilitado }) {
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const aoClicar = (acao) => {
    setSalvando(true);
    acao()
      .then(
        (strSucesso) =>
          strSucesso && alerta.adicionaAlerta(undefined, strSucesso)
      )
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvando(false));
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant={"secondary"}
        disabled={desabilitado || salvando}
      >
        {salvando ? (
          <Spinner animation="grow" size="sm" className="me-2" />
        ) : undefined}
        {textoBotao}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {dadosMenu?.map(({ texto, visible, acao }) => {
          return visible ? (
            <Dropdown.Item
              as="button"
              onClick={() => aoClicar(acao)}
              key={gerarChaveUnica()}
            >
              {texto}
            </Dropdown.Item>
          ) : undefined;
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
