import { useState } from "react";
import CardRadios from "../../components/cards/CardRadios";
import { Alunos } from "./Alunos";
import { Coordenadores } from "./Coordenadores";
import { Preceptores } from "./Preceptores";

export default function Users() {
  const [indexRadio, setIndexRadio] = useState(0);

  const radios = ["Coordenadores", "Preceptores / Professores", "Alunos"];

  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      {indexRadio === 0 ? (
        <Coordenadores />
      ) : indexRadio === 1 ? (
        <Preceptores />
      ) : (
        <Alunos />
      )}
    </CardRadios>
  );
}
