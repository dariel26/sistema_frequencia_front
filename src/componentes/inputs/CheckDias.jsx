import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const segunda = 1;
const terca = 2;
const quarta = 3;
const quinta = 4;
const sexta = 5;
const sabado = 6;
const domingo = 0;

export default function CheckDias({ dias = {}, aoMudar, id, desabilitado }) {
  const [diasSelecionados, setDiasSelecionados] = useState({
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (dias.segunda === undefined) return;
    setDiasSelecionados(dias);
  }, [dias]);

  const aoSelecionar = (valor, selecionado) => {
    let dado = {};
    if (valor === 0) dado.domingo = selecionado;
    else if (valor === 1) dado.segunda = selecionado;
    else if (valor === 2) dado.terca = selecionado;
    else if (valor === 3) dado.quarta = selecionado;
    else if (valor === 4) dado.quinta = selecionado;
    else if (valor === 5) dado.sexta = selecionado;
    else if (valor === 6) dado.sabado = selecionado;

    setSalvando(true);
    aoMudar(dado).finally(() => setSalvando(false));
    setDiasSelecionados(Object.assign(dias, dado));
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
        checked={diasSelecionados.segunda ?? false}
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
        checked={diasSelecionados.terca ?? false}
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
        checked={diasSelecionados.quarta ?? false}
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
        checked={diasSelecionados.quinta ?? false}
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
        checked={diasSelecionados.sexta ?? false}
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
        checked={diasSelecionados.sabado ?? false}
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
        checked={diasSelecionados.domingo ?? false}
        onChange={(e) => aoSelecionar(domingo, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor={"domingo" + id}>
        Domingo
      </label>
      <MeuSpinner />
    </div>
  );
}
