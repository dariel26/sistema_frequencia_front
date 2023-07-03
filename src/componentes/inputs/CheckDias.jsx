import { useEffect } from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

const segunda = 1;
const terca = 2;
const quarta = 3;
const quinta = 4;
const sexta = 5;
const sabado = 6;
const domingo = 0;

export default function CheckDias({
  dias = [],
  aoMudar,
  datasEscolhidas,
  id,
  desabilitado,
}) {
  const [diasSelecionados, setDiasSelecionados] = useState(dias);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const dias = [];
    datasEscolhidas?.forEach((d) => {
      if (!dias.includes(d.getDay())) {
        dias.push(d.getDay());
      }
    });
    setDiasSelecionados(dias);
  }, [datasEscolhidas]);

  const aoSelecionar = (valor, selecionado) => {
    let novosDias = diasSelecionados;
    if (selecionado) {
      novosDias.push(valor);
    } else {
      novosDias = novosDias.filter((v) => v !== valor);
    }
    setSalvando(true);
    aoMudar(novosDias).finally(() => setSalvando(false));
    setDiasSelecionados(Object.assign([], novosDias));
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
        id={"segunda" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.some((v) => v === segunda)}
        onChange={(e) => aoSelecionar(segunda, e.target.checked)}
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
        checked={diasSelecionados.some((v) => v === terca)}
        onChange={(e) => aoSelecionar(terca, e.target.checked)}
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
        checked={diasSelecionados.some((v) => v === quarta)}
        onChange={(e) => aoSelecionar(quarta, e.target.checked)}
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
        checked={diasSelecionados.some((v) => v === quinta)}
        onChange={(e) => aoSelecionar(quinta, e.target.checked)}
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
        checked={diasSelecionados.some((v) => v === sexta)}
        onChange={(e) => aoSelecionar(sexta, e.target.checked)}
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
        checked={diasSelecionados.some((v) => v === sabado)}
        onChange={(e) => aoSelecionar(sabado, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"sabado" + id}>
        Sábado
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id={"domingo" + id}
        autoComplete="off"
        disabled={desabilitado || salvando}
        checked={diasSelecionados.some((v) => v === domingo)}
        onChange={(e) => aoSelecionar(domingo, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"domingo" + id}>
        Domingo
      </label>
      <MeuSpinner />
    </div>
  );
}
