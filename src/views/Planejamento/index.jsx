import { useState } from "react";
import CardRadios from "../../components/cards/CardRadios";
import Estagios from "./Estagios";
import Grupos from "./Grupos";
import Atividades from "./Atividades";

export default function Organization() {
  const [indexRadio, setIndexRadio] = useState(0);
  const radios = ["Grupos", "Estágios", "Atividades"];

  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      <div className="container-fluid">
        {indexRadio === 0 ? (
          <Grupos />
        ) : indexRadio === 1 ? (
          <Estagios />
        ) : indexRadio === 2 ? (
          <Atividades />
        ) : undefined}
      </div>
    </CardRadios>
  );
}
