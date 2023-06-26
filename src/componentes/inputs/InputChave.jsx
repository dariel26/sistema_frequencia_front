import { useState } from "react";

export default function InputChave({
  valorInicial = false,
  textoVerdade = "Sim",
  textoFalso = "Não",
  aoMudar,
}) {
  const [ativo, setAtivo] = useState(valorInicial);

  const aoClicar = (e) => {
    if (aoMudar) aoMudar(e.target.checked);
    setAtivo(e.target.checked);
  };

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
        checked={ativo}
        onChange={aoClicar}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        {ativo ? textoVerdade : textoFalso}
      </label>
    </div>
  );
}
