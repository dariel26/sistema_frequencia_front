import { useState } from "react";
import CardRadios from "../../components/cards/CardRadios";
import Estagios from "./Estagios";
import Grupos from "./Grupos";

export default function Organization() {
  const [indexRadio, setIndexRadio] = useState(0);
  const radios = ["Grupos", "Estágios", "Atividades"];
  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      {indexRadio === 0 ? (
        <Grupos />
      ) : indexRadio === 1 ? (
        <Estagios />
      ) : undefined}
    </CardRadios>
  );
}
