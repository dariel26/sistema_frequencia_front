import { useState } from "react";

const segunda = 1;
const terca = 2;
const quarta = 3;
const quinta = 4;
const sexta = 5;
const sabado = 6;
const domingo = 0;

export default function CheckDias({ dias = [], aoMudar }) {
  const [diasSelecionados, setDiasSelecionados] = useState(dias);

  const aoSelecionar = (valor, selecionado) => {
    let novosDias = diasSelecionados;
    if (selecionado) {
      novosDias.push(valor);
    } else {
      novosDias = novosDias.filter((v) => v !== valor);
    }
    if (aoMudar) aoMudar(novosDias);
    setDiasSelecionados(Object.assign([], novosDias));
  };

  return (
    <div
      className="btn-group"
      role="group"
      aria-label="Basic checkbox toggle button group"
    >
      <input
        type="checkbox"
        className="btn-check"
        id="segunda"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === segunda)}
        onChange={(e) => aoSelecionar(segunda, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="segunda">
        Segunda
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="terca"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === terca)}
        onChange={(e) => aoSelecionar(terca, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="terca">
        Terca
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="quarta"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === quarta)}
        onChange={(e) => aoSelecionar(quarta, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="quarta">
        Quarta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="quinta"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === quinta)}
        onChange={(e) => aoSelecionar(quinta, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="quinta">
        Quinta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="sexta"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === sexta)}
        onChange={(e) => aoSelecionar(sexta, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="sexta">
        Sexta
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="sabado"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === sabado)}
        onChange={(e) => aoSelecionar(sabado, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="sabado">
        Sábado
      </label>
      <input
        type="checkbox"
        className="btn-check"
        id="domingo"
        autoComplete="off"
        checked={diasSelecionados.some((v) => v === domingo)}
        onChange={(e) => aoSelecionar(domingo, e.target.checked)}
      />
      <label className="btn btn-outline-primary" htmlFor="domingo">
        Domingo
      </label>
    </div>
  );
}
