import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  DOMINGO,
  QUARTA,
  QUINTA,
  SABADO,
  SEGUNDA,
  SEXTA,
  TERCA,
} from "../../utils";

export default function CheckDias({
  dias,
  aoMudar,
  id,
  desabilitado,
  assincrono = true,
}) {
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setDiasSelecionados(dias ?? []);
  }, [dias]);

  const aoSelecionar = (valor) => {
    let dadosAtuais = [...diasSelecionados];
    if (dadosAtuais.includes(valor))
      dadosAtuais = dadosAtuais.filter((d) => d !== valor);
    else dadosAtuais.push(valor);

    if (!assincrono) {
      aoMudar(dadosAtuais);
      return setDiasSelecionados(dadosAtuais);
    }

    setSalvando(true);
    aoMudar(dadosAtuais).finally(() => setSalvando(false));
    setDiasSelecionados(dadosAtuais);
  };

  const MeuSpinner = () => {
    return salvando ? (
      <div className="d-flex align-items-center">
        <Spinner
          animation="grow"
          size="sm"
          variant="primary"
          className="ms-2"
        />
      </div>
    ) : undefined;
  };

  return (
    <div
      className="btn-group text-middle"
      role="group"
      aria-label="Basic checkbox toggle button group"
    >
      <input
        type="checkbox"
        className="btn-check"
        id={"domingo" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(DOMINGO)}
        onChange={(e) => aoSelecionar(DOMINGO, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"domingo" + id}>
        Domingo
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"segunda" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(SEGUNDA)}
        onChange={(e) => aoSelecionar(SEGUNDA, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"segunda" + id}>
        Segunda
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"terca" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(TERCA)}
        onChange={(e) => aoSelecionar(TERCA, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"terca" + id}>
        Terca
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"quarta" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(QUARTA)}
        onChange={(e) => aoSelecionar(QUARTA, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"quarta" + id}>
        Quarta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"quinta" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(QUINTA)}
        onChange={(e) => aoSelecionar(QUINTA, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"quinta" + id}>
        Quinta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"sexta" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(SEXTA)}
        onChange={(e) => aoSelecionar(SEXTA, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"sexta" + id}>
        Sexta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"sabado" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.includes(SABADO)}
        onChange={(e) => aoSelecionar(SABADO, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"sabado" + id}>
        Sábado
      </label>
      <MeuSpinner />
    </div>
  );
}
