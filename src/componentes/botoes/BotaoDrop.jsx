import { useContext, useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import uuid from "react-uuid";
import { SistemaContext } from "../../contexts";
import { errors } from "../../utils";

export default function BotaoDrop({ textoBotao, dadosMenu, desabilitado }) {
  const [salvando, setSalvando] = useState(false);

  const { error, sucesso } = useContext(SistemaContext);

  const aoClicar = (acao) => {
    setSalvando(true);
    acao()
      .then((msg) => msg && sucesso(msg))
      .catch((err) => error(errors.filtraMensagem(err)))
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
              key={uuid()}
            >
              {texto}
            </Dropdown.Item>
          ) : undefined;
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
